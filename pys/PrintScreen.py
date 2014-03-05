# -*- coding: utf-8 -*-
# printscreen-yornwat-20140115


from com.android.monkeyrunner import MonkeyRunner as MR#, MonkeyDevice as MD, MonkeyImage as MI

print('import..OK')
d = MR.waitForConnection()
print('device..OK')
d.takeSnapshot().writeToFile(r'C:\Shared\mr-py\1.png', 'png')
print('--PrintScreen--')
