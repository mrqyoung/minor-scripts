# coding:utf-8

from os import popen as CMD
from time import sleep

adb = r'D:\Dev\android-sdk-windows\platform-tools\adb.exe'
device_id = '358bb2df'
app_package = 'com.demo.android'
main_activity = '.view.demoAndroid'
launcher = app_package + '/' + '.view.demoAndroid'
shell = adb + ' shell '
cmds = {
    'cmd_launch': shell + 'am start -W -n ' + launcher,
    'cmd_current_activity' : shell + 'dumpsys window windows',
    'cmd_tap' : shell + 'input tap %d %d',
    'cmd_back' : shell + 'input keyevent 4',
    #'cmd_' : '',
}
coords = {
    'baoku': (630, 1220),
    'zl_zl_tx': (360, 200),
    'sjxc': (360, 1111),
    'imgs': {0:(270, 400), 1:(450, 400), 2:(630, 400), 3:(90, 580),},
    'tijiao': (660, 111),
    'queren': (360, 760),
}
cmds_eg = {
    r'''adb -s f wait-for-device''',
    r'''adb -s f shell "getprop ro.build.version.sdk"''',
    r'''adb -s f forward tcp:4724 tcp:4724''',
    r'''adb -s f shell "dumpsys window"''',
    r'''adb -s f shell "am start -S -a android.intent.action.MAIN -c android.intent.category.LAUNCHER -f 0x10200000 -n com.demo.android/.view.demoAndroid"''',
    r'''shell "dumpsys window windows"''',
    # mCurrentFocus=Window{42eb46d8 u0 com.demo.android/com.demo.android.view.PublicFmActivity}
    r'''''',
}

def tap(coord):
    CMD(cmds['cmd_tap'] % coord)

def back(x=1):
    for i in range(x):
        CMD(cmds['cmd_back'])
        sleep(1)

def init():
    CMD(cmds['cmd_launch'])
    sleep(5)
    r = CMD(cmds['cmd_current_activity'])
    #sleep(1)
    for line in r.readlines():
        if line.startswith('\x20\x20mCurrentFocus'):
            print(line)
            if line.endswith('demo.android.view.MenuActivity}\n'):
                print('launch OK')
            else:
                raise(Exception('app launch error'))
            break
    else:
        print('command error: at get current activity')


def reset_app():
    pass

def upload_icon(i=0):
    tap(coords['baoku'])
    sleep(1)
    tap(coords['zl_zl_tx'])
    sleep(2)
    tap(coords['zl_zl_tx'])
    sleep(2)
    tap(coords['zl_zl_tx'])
    sleep(1)
    tap(coords['sjxc'])
    sleep(1)
    tap(coords['imgs'][i%4])
    sleep(1)
    tap(coords['tijiao'])
    sleep(9)
    back(3)
    sleep(1)
    pass

def start(c=1, is_first=True):
    is_first and init()
    for i in range(c):
        print(i+1)
        upload_icon(i)
    pass


if __name__ == '__main__':
    #start(300)
    start(300, False)
