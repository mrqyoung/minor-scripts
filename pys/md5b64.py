#!/usr/bin/env python3
# coding:utf-8


"""
Base64  MD5  UrlEncode  UrlDecode  TimeFormat
"""


UTF8 = 'utf-8'


""" md5 """
def get_md5_hex(s):
    s = s.encode(UTF8)
    from hashlib import md5
    m = md5()
    m.update(s)
    return m.hexdigest()

def get_md5_hex_upper(s):
    from hashlib import md5
    ret = get_md5_hex(s)
    return ret.upper()

""" base64 """
def encode_b64(s):
    s = s.encode(UTF8)
    import base64
    return base64.b64encode(s).decode(UTF8)

def decode_b64(s):
    import base64
    return base64.b64decode(s).decode(UTF8)

def encode_url_b64(s):
    s = s.encode(UTF8)
    import base64
    return base64.urlsafe_b64encode(s).decode(UTF8)

def decode_url_b64(s):
    import base64
    return base64.urlsafe_b64decode(s).decode(UTF8)

""" url """
def encode_url(s):
    from urllib.parse import quote_plus
    return quote_plus(s)

def decode_url(s):
    from urllib.parse import unquote_plus
    return unquote_plus(s)

""" time """
def sec_to_str(s):
    sec = int(s)
    ms = None
    if len(s) > 10:
        sec /= 1000
        ms = s[-3:]
    import time
    t = time.localtime(sec)
    ret = time.strftime('%Y-%m-%d %H:%M:%S', t)
    if ms is not None:
        ret = '%s,%s' % (ret, ms)
    return ret

def str_to_sec(s):
    ss = s.split(',')
    sec = ss[0]
    #ms = ms[1] if len(ss) == 2 else 0
    import time
    time_tuple = time.strptime(sec, '%Y-%m-%d %H:%M:%S')
    ret = time.mktime(time_tuple)
    ret *= 1000
    if len(ss) == 2:
        ret += int(ss[1])
    return int(ret)



func = {
    'md5': get_md5_hex,
    'md5u': get_md5_hex_upper,
    'b64': encode_b64,
    'd64': decode_b64,
    'ub64': encode_url_b64,
    'ud64': decode_url_b64,
    'url': encode_url,
    'durl': decode_url,
    'ms2t': sec_to_str,
    't2ms': str_to_sec,
}

if __name__ == '__main__':
    help = lambda s=None: 'Usage: [md5 | md5u | b64 | d64 | ub64 | ud64 | url | durl | ms2t | t2ms] your-string'
    print(help())
    print('eg: ',
          'Get MD5 message-digest \t> md5 hello,world',
          'Base64 decode \t\t> d64 aGVsbG8=',
          'URL encode \t\t> url http://g.cn/?q=1',
          'MilliSeconds to time \t> ms2t 1449730148886',
          'Time to milliSeconds \t> t2ms 2015-12-10 14:49:08,001',
          '',
          sep='\n'
          )
    while True:
        _in = input('> ')
        if _in == 'q': break
        cmd = _in.split(' ')
        if len(cmd) < 2:
            print('Bad input, try again. q for exit')
            continue
        method, arg = cmd[0], ' '.join(cmd[1:])
        print(func.get(method, help)(arg))
