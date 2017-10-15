#!/usr/bin/env python3
# coding: utf-8


import socket
import threading
import sys
import time


DEBUG = True and 0
MAX_MESSAGE_BODY = 140  # 140-character limit
BUFFER_SIZE = 1024  # max bytes limit = utf-8(body) + control characters 
PORT = 6666


class BaseMessenger(object):

    def __init__(self):
        self.sock = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
 
    def __enter__(self):
        return self

    def __exit__(self, typee, value, trackback):
        self.sock.close()


class Broadcast(BaseMessenger):

    HI = '@hi:from:'
    BYE = '@bye::'

    def __init__(self):
        self.broadcast_addr = ('255.255.255.255', PORT)
        super().__init__()
        self.sock.setsockopt(socket.SOL_SOCKET, socket.SO_BROADCAST, 1)
        self.sock.connect(('<broadcast>', 0))
        self.ip = self.sock.getsockname()[0]
        return

    def say(self, something):
        self.sock.sendto(something.encode(), self.broadcast_addr)

    def say_hi(self, src):
        #msg = '@hi:from:{}'.format(src)
        msg = Broadcast.HI + src
        self.say(msg)
        return

    def say_bye(self):
        self.say(Broadcast.BYE)
        return

    pass # EOC


class Messenger(BaseMessenger):
    """ 帮助

    @                   清空当前会话。即初始值，无聊天对象
    @name [msg]         与某人聊天。
    :?                  帮助
    :h                  帮助
    :help               帮助
    :ls [ip|name]       显示在线列表。带参数时显示某人是否在线
    :list [ip|name]     显示在线列表。带参数时显示某人是否在线
    :q                  退出
    :bye                退出
    :exit               退出
    :quiet              不显示系统消息
    :autochange         用@发消息时，自动切换并保持与其对话
    
    TODO:               暂未实现的功能
    :export [file-name] 聊天记录下载
    :file <file-path>   文件传输
    :ignore [ip|name]   黑名单
    
    用户名：
    当输入的用户名不符合3~16的长度，将会自动设置为 `User`
    当设置的用户名已经存在时，显示为 `Name(ip)` 的形式
    """

    def __init__(self, name):
        self.addr = ('', PORT)
        self.name = name
        super().__init__()
        self.sock.bind(self.addr)
        self.ip = '127.0.0.1'
        self.chat_list = {}  # should be: addr(ip) -> name pair
        self.autochange = False
        self.quiet = False
        self.to = ''
        self.commands = {
                ':h': self.usage,
                ':?': self.usage,
                ':help': self.usage,
                ':ls': self.show_chat_list,
                ':list': self.show_chat_list,
                ':quiet': self.set_quiet,
                ':autochange': self.set_autochange,
                '@': self.at_someone,
                }
        return

    def _receive(self):
        while True:
            data, addr = self.sock.recvfrom(BUFFER_SIZE)
            #print('--test--', data, addr)
            data = data.decode()
            addr = addr[0]
            if data == Broadcast.BYE:
                if addr == self.ip:
                    break
                else:
                    self.handle_user_off(addr)
            elif data.startswith(Broadcast.HI):
                self.handle_user_on(data[9:], addr)
            else:
                self.handle_msg(data, addr)
                d('normal msg received')
        return

    def handle_user_on(self, name, addr):
        if not name or not addr:
            return False
        if addr == self.ip or addr == '127.0.0.1':
            d('self say hi')
            return True
        if addr in self.chat_list:
            d('already in my list')
            return True
        self.chat_list[addr] = name if name not in self.chat_list.values() else '{}({})'.format(name, addr)
        # say hi back
        self.say_to(Broadcast.HI + self.name, addr)
        if self.quiet: return True
        self.hint( ('{0} is online. (Total: #{1})\n'
                    'Use "@{0} " to chat with him/her.\n'
                    'Use ":list" to show online list.\n'
                    'Use ":help" for help at any time.'
                ).format(self.chat_list[addr], len(self.chat_list)) )
        return True

    def handle_user_off(self, addr):
        d('someone left:' + addr)
        is_on_list = addr in self.chat_list.keys()
        if is_on_list:
            self.chat_list.pop(addr)
        else:
            warn('The %s should be on my list but we cannot find it.' % addr)
        return is_on_list

    def handle_msg(self, msg, addr):
        name = self.chat_list.get(addr)
        return False if name is None else self.display(msg, name)

    def handle_input(self, words):
        d(words)
        if len(words) > MAX_MESSAGE_BODY:
            self.hint('Message too long. Max length is %d' % MAX_MESSAGE_BODY)
            return False
        if words[0] in ('@', ':'):
            return self.handle_command(words)
        if not self.to:
            self.hint('To whom?\n'
                      'Use "@the-name" to point out whom you want to send to\n'
                      'For more help, use command ":help"')
            return False
        return self.say_to_name(words, self.to)

    def handle_command(self, cmd):
        cmd = cmd.split()
        if cmd[0].startswith('@'):
            return self.at_someone(cmd[0][1:], cmd[1:])
        func = self.commands.get(cmd[0].lower())
        if func is None:
            self.hint('Bad command: "%s"\nUse ":help" for help.' % cmd)
            return False
        func(*cmd[1:])
        return True

    def hint(self, msg):
        body = '\n{0}\n{1}\n{0}'.format('*' * 10, msg)
        self.display(body, name='System')
        return

    def usage(self, *args):
        print(self.__doc__)
        return

    def welcome(self):
        self.hint('Welcome aboard.\n":help" for help.\n":q" or ":exit" to exit.')
        time.sleep(1)   # time for finding onlie guys
        self.show_chat_list()
        print('Use "@name" to talk to that guy.\n\n')
        return

    def show_chat_list(self, name=None):
        guys = '\n'.join(['{1}\t\t{0}'.format(k, v) for k,v in self.chat_list.items() 
            if name is None or name == k or name.title() == v])
        body = ('Online #{}:\n'
                'Name\t\tIP\n'
                '--------\t--------\n'
                '{}\n').format(len(self.chat_list), guys)
        body = 'Oops! Nothing found.' if (name is not None and not guys) else body
        self.hint(body)
        return

    def change_at(self, name):
         if name in self.chat_list.values():
            self.to = name
            print('--> @' + name)
            return True
        self.hint(name + ' is not online.')
        return False

    def at_someone(self, name='', msg=''):
        d(name)
        d(msg)
        if not name:  # TODO: handle "@ name"
            self.to = ''
            return True
        name = name.title()
        if not msg:  # "@name" means change dest to name
            return self.change_at(name)
        if self.say_to_name(' '.join(msg), name):
            if self.autochange:
                self.change_at(name)
            return True
        return False

    def set_quiet(self, quiet=True):
        self.quiet = bool(quiet)
        print('--> Quiet:', self.quite)
        return self.quiet

    def set_autochange(self, auto=True):
        if self.autochange == bool(auto): return auto
        self.autochange = bool(auto)
        print('--> Auto-change:', self.autochange)
        return self.autochange

    def online(self):
        with Broadcast() as broadcast:
            self.ip = broadcast.ip
            broadcast.say_hi(src=self.name)
        d('online:' + self.ip)
        return

    def offline(self):
        d('offline')
        with Broadcast() as broadcast:
            broadcast.say_bye()
        return

    def display(self, msg, name='Me'):
        print(time.strftime('[%H:%M:%S]'), name, ':', msg)
        return name.startswith('To')

    def start(self):
        receiver = threading.Thread(target=self._receive)
        receiver.start()
        #receiver.join()
        self.online()
        self.welcome()
        d('starting')

    def typing(self):
        while True:
            words = input()
            if not words: continue
            d(words)
            if words in (':q', ':exit', ':bye'):
                self.offline()
                break
            self.handle_input(words)
        return

    def say_to(self, msg, addr):
        self.sock.sendto(msg.encode(), (addr, PORT))
        return True

    def say_to_name(self, msg, name):
        addr = None
        try:
            addr = list(self.chat_list.keys())[list(self.chat_list.values()).index(name)]
            self.display(msg, 'To <%s>' % name)
        except:
            self.hint('Can not send to %s. He/She is not online.' % name)
            return False
        return self.say_to(msg, addr)

    pass # EOC


def d(s):
    if DEBUG: print('--<debug>--', s)

def warn(msg):
    pass  # TODO Better use logger to log warnings into log file

def main(name):
    name = (3 <= len(name) <= 16 ) and name or 'User'
    with Messenger(name.title()) as user:
        user.usage()
        user.start()
        user.typing()
    print('See you.')


if __name__ == '__main__':
    whom = argv[1] if len(sys.argv) > 1 else input('We need a name: ')
    main(whom)
