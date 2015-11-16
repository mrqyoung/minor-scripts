#!/usr/bin/env python3
# coding:utf-8


"""
Base64  MD5
"""


import base64
from hashlib import md5


def get_md5_hex(s):
    m = md5()
    m.update(s)
    return m.hexdigest()

def get_md5_hex_upper(s):
    ret = get_md5_hex(s)
    return ret.upper()


def encode_b64(s):
    return base64.b64encode(s).decode('utf-8')

def decode_b64(s):
    return base64.b64decode(s).decode('utf-8')

def encode_url_b64(s):
    return base64.urlsafe_b64encode(s).decode('utf-8')

def decode_url_b64(s):
    return base64.urlsafe_b64decode(s).decode('utf-8')


func = {
    'md5': get_md5_hex,
    'md5u': get_md5_hex_upper,
    'b64': encode_b64,
    'd64': decode_b64,
    'ub64': encode_url_b64,
    'ud64': decode_url_b64,
}

if __name__ == '__main__':
    help = lambda s=None: 'Usage: [md5 | md5u | b64 | d64 | ub64 | ud64] your-string'
    print(help())
    print('eg: md5 hello,world\n')
    while True:
        _in = input('> ')
        if _in == 'q': break
        cmd = _in.split(' ')
        if len(cmd) != 2:
            print('Bad input, try again. q for exit')
            continue
        print(func.get(cmd[0], help)(cmd[1].encode('utf-8')))


