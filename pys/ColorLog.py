#!/usr/bin/env python3
# coding: utf-8



class Color(object):
    """ ANSI colors and background colors

    See: https://en.wikipedia.org/wiki/ANSI_escape_code
    """
    TEMPLATE0 = '\x1B[%dm%s\x1B[0m'
    TEMPLATE1 = '\x1B[%d;%dm%s\x1B[0m'
    black = 30
    red = 31
    green = 32
    yellow = 33
    blue = 34
    magenta = 35
    cyan = 36
    white = 37
    class bg:
        def __getattr__(self, attr):
            return getattr(Color, attr) + 10
    bg = bg()
    

def _log(color=Color.white, s=''):
    print(Color.TEMPLATE0 % (color, s))

def _log_with_bg(bg=Color.bg.white, s='', color=Color.black):
    print(Color.TEMPLATE1 % (color, bg, s))


# VERBOSE
def v(s):
    _log(Color.green, s)

def vv(s):
    _log_with_bg(Color.bg.green, s)

# DEBUG
def d(s):
    _log(Color.magenta, s)

def dd(s):
    _log_with_bg(Color.bg.magenta, s)

# INFO
def i(s):
    _log(Color.blue, s)

def ii(s):
    _log_with_bg(Color.bg.blue, s)

# WARN
def w(s):
    _log(Color.yellow, s)

def ww(s):
    _log_with_bg(Color.bg.yellow, s)

# ERROR
def e(s):
    _log(Color.red, s)

def ee(s):
    _log_with_bg(Color.bg.red, s)


if __name__ == '__main__':
    text = 'The quick brown fox jumps over the lazy dog'
    v(text)
    d(text)
    i(text)
    w(text)
    e(text)
    print('-' * 43)
    vv(text)
    dd(text)
    ii(text)
    ww(text)
    ee(text)

