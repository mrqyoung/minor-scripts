# -*- coding: utf-8 -*-
# pt-dropbox-20130905
# mrqyoung

import sys, time
from com.android.monkeyrunner import MonkeyRunner, MonkeyDevice, MonkeyImage

print('import..OK')


device = MonkeyRunner.waitForConnection() #deviceId=''
print('device..OK')

def clickAndTime(p, imgName, case):
    choosefile(case==0)
    img0 = getImage(imgName)
    device.touch(p[0], p[1], 'DOWN_AND_UP')
    timeStart = time.time()
    waitFor(img0, case)
    timeEnd = time.time() 
    print(timeEnd - timeStart - 1.8)

def waitFor(img, case):
    imgRect = (32, 480, 56, 70) # upl-doc
    if case == 1:
	imgRect = (120, 480, 56, 70) # upl-pic
    while (True):
        img2 = device.takeSnapshot()
        img1 = img2.getSubImage(imgRect)
        if img1.sameAs(img, 0.9): break
	MonkeyRunner.sleep(0.1)
    return

def imgSame(img, imgRect):
    # upl/dl: 240, 200, 240, 40
    # upd: 240, 1180, 240, 50
    img1 = device.takeSnapshot().getSubImage(imgRect)
    return img1.sameAs(img, 0.9)

def getImage(imgName):
    return MonkeyRunner.loadImageFromFile(path=(sys.path[0][21:] + '\\imgs\\' + imgName))

def testCase(casesName):
    return MonkeyRunner.choice('',casesName ,'')

def choosefile(isDoc):
    device.press('KEYCODE_MENU',MonkeyDevice.DOWN_AND_UP)
    MonkeyRunner.sleep(1)
    device.touch(360,550,'DOWN_AND_UP') #up to here
    MonkeyRunner.sleep(1)
    device.touch(360,720,'DOWN_AND_UP') # other files
    MonkeyRunner.sleep(1)
    device.touch(360,170,'DOWN_AND_UP') # folder 1 in list
    MonkeyRunner.sleep(1)
    dY = [550, 800]
    if isDoc:
        device.touch(360, dY[1],'DOWN_AND_UP') # doc folder
    else:
        device.touch(360, dY[0],'DOWN_AND_UP') # pic folder
    MonkeyRunner.sleep(1)
    device.touch(360,300,'DOWN_AND_UP') # choose 1 in list
    MonkeyRunner.sleep(1)
    device.touch(500,1230,'DOWN_AND_UP') # btn-upload
    MonkeyRunner.sleep(1)

if __name__ == '__main__':
    #device.takeSnapshot().getSubImage((120, 480, 56, 70)).writeToFile('1.png');sys.exit(0);
    loopTimes = 10
    while (loopTimes):
      casesName = ['1.upload file', '2.upload image', '3.backup']
      #case = testCase(casesName)
      case = 1
      if case == -1 : break
      print('-' * 16)
      print(casesName[case])
      imgs = ['doc.png', 'pic.png' ,'bak.png']
      btns = [(500, 800), (500, 800), (500, 760)]
      # 500, 760 dialog right button
      clickAndTime(btns[case], imgs[case], case)
      loopTimes -= 1

