#!/usr/bin/env python3
# coding: utf-8


T = {
        "_": "{0}<{1}>: ",
        "<class 'dict'>": "{}{{{}}}:\n",
        "<class 'list'>": "{}[{}]:\n",
    }

def pdict(arg, ind=0, sep='\t'):
    for k, v in arg.items():
            print(T.get(str(type(v)), T['_']).format(ind * sep, k), end='')
            pprint(v, ind+1)
    return 0

def plist(arg, ind=0, sep='\t'):
    for i in arg:
            if isinstance(i, dict):
                print(ind * sep, '[{}]:', sep='')
                pprint(i, ind+1)
            elif isinstance(i, list):
                print(ind * sep, '[[]]:', sep='')
                pprint(i, ind+1)
            else: print(ind * sep, i, sep='')
    return 1

def pmisc(arg, ind=0, sep='\t'):
    print(arg)
    return 2

F = {
        "_": pmisc,
        "<class 'dict'>": pdict,
        "<class 'list'>": plist,
    }


def pprint(arg, indent=0, sep='\t'):
    F.get(str(type(arg)), F['_'])(arg, indent, sep)


if __name__ == '__main__':
    data = {'aa':'sss', 'bb':{'b11':11, 'b22':22, 'b33':33}, 'cc':[44, 55, {'ff':99, 'gg':'00'}, [100, 200, 300]], 'dd':(66, 77), 'ee':88}
    print(data, '\n', '=' * 40)
    pprint(data)
    print('=' * 40)
