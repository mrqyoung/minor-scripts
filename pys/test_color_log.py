#! /usr/bin/env python3


import ColorLog as Log

text = '- The quick brown fox jumps over the lazy dog'
print('=' * 45)
Log.v(text)
Log.d(text)
Log.i(text)
Log.w(text)
Log.e(text)
print('-' * 45)
Log.vv(text)
Log.dd(text)
Log.ii(text)
Log.ww(text)
Log.ee(text)
print('-' * 45)

for idx, word in enumerate(text.split(' ')):
    i = 30 + idx if idx < 8 else 30 + idx % 7
    print(Log.Color.TEMPLATE0 % (i, word), end=' ')
print()
for idx, word in enumerate(text.split(' ')):
    i = 40 + idx if idx < 8 else 40 + idx % 7
    print(Log.Color.TEMPLATE1 % (Log.Color.black, i, word), end=' ')
print()
print('=' * 45)
