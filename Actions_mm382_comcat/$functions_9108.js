/****************************************************************************************
* 创建日期: 25-Feb-2013
* 作者: Yorn Wat
* 描述: functions
*
* 修改日期:
* 修改人:
* 描述: 　
*
****************************************************************************************/

// define the package-name of MobileMarket
//var MM_packageName = "com.aspire.mm";
var NeededForceStart = true;
var CheckOnly = false;
var ScreenSize = "0";

     
/** Verify Point by image
 *  param: String image path
 *  return: boolean match
 */
function imgVP(imgName) {
	if (ScreenSize == "0") {
		ScreenSize = getScreenSize(device0);
		NGLogger.Info("当前device0的屏幕分辨率为：" + ScreenSize);
	}
	imgPath = ScreenSize + "\\" + imgName;
	NGLogger.Info("图片验证点：" + imgPath);
    return NGVerifyPointManager.GetVerifyPoint(imgPath).DoVerify();
}


/** Check if the current screen is home-page of MobileMarket 
 *  param: boolean: forceToHome; [True = force start, False = ignore]
 *  return: boolean isHomePage
 */
function isHomePage(forceToHome) { //Samsung I9108
    if (imgVP("LAUNCH_OK")) {
        NGLogger.UserLog("i9108", "Mobile Market Home", "Green");
        return true;
    } else {
        NGLogger.Warning("Mobile Market Home - NOT FOUND");
        //return false;
    }
   
    if (forceToHome) {
		if (backToHome(9)) return true;
        NGLogger.Warning("不能回到首页, 强制停止MM然后重新启动...");
        NGLogger.LogScreen(0);
        stopMM(clearData=false);
        return startMM(); //完全重启
	}
	return false;
}

     
/** Kill MM process, and clear data if asked
 *  param: boolean clearData [True=clear|False=skip]
 *  return: boolean MMStoped
 */
function stopMM(clearData) { //Samsung I9108
	var loopCounter=0; //循环计数器
	NGLogger.Info("从应用程序管理里关闭MM");
    device0.GUICOMMON_Key_Home(); Sleep(1000);
    device0.GUICOMMON_Key_Back(); Sleep(1000);  //for close tip-window
    NGLogger.Info("--------HOME--------");
    device0.GUICOMMON_Key_Menu(); Sleep(500);
    NGLogger.Info("点击菜单中的设置");
    device0.GUICOMMON_TouchScreen("400","750");    Sleep(1000);
    NGLogger.Info("打开应用程序");
    device0.GUICOMMON_TouchScreen("125","720");    Sleep(1000);
    NGLogger.Info("打开管理应用程序");
    device0.GUICOMMON_TouchScreen("125","200");    Sleep(1000);
    if (!imgVP("APP_MGR")) {
    	NGLogger.LogScreen(0);
    	if (loopCounter > 5) {
    		NGLogger.Error("E70:打开管理应用程序界面失败, 中断。");
    		return false;
    	}
    	NGLogger.Warning("打开管理应用程序界面失败，重试...");
    	loopCounter++;
    	stopMM(clearData);
    } else {
    	loopCounter = 0; //循环计数器复位
    }
    while (!imgVP("MM_APP")) {
    	if (loopCounter > 30) {
    		NGLogger.Error("E81:未找到MM应用程序, 中断。");
    		NGLogger.LogScreen(0);
    		return false;
    	}
    	device0.GUICOMMON_Key_Dpad_Down();  Sleep(1000);
    	loopCounter++;
    }
    //经过以上的操作，可以确定已找到MM图标
    NGLogger.Info("已找到MM应用程序的图标");
    TouchScreenByImage(device0, ScreenSize + "\\MM_APP");//点击MM商场图标
    Sleep(1000);
   clearOrStop:
    if (clearData) {
        device0.GUICOMMON_TouchScreen("120","480"); //点击清除数据
        NGLogger.Info("点击清除数据");
    } else {
    	device0.GUICOMMON_TouchScreen("120","180"); //点击强制停止
    	NGLogger.Info("点击强制停止");
    }  //会出现清除数据或者强制停止的确认窗口
	Sleep(1000);
	device0.GUICOMMON_Key_Dpad_Down();
	Sleep(500);
	device0.GUICOMMON_Key_Dpad_Center(); //对提示窗按下确定按钮
	Sleep(500);
	if (imgVP("MM_STOPED")) {
		NGLogger.Info("MM已停止");
		device0.GUICOMMON_Key_Home();
		Sleep(500);
		return true;
	} else {
		continue clearOrStop;
	}
    return false;
}


/** Normally start MM
 *  param: 
 *  return: start OK
 */
function startMM() {
	NGLogger.UserLog("启动", "--------启动MM--------", System.Color.Green);
    device0.GUICOMMON_StartByPackageName(MM_packageName);
    Sleep(5000); 
      	  	for (var i = 0; i < 10 ; i++) {
      	  		if (isHomePage()) {
      	  		    NGLogger.Info("成功启动MM");
      	  		    return true;
      	  		    //break;
      	  		}
      	  		if (imgVP("HINT_NEW")) {
      	  		    NGLogger.Info("出现手机很新的温馨提示");
      	  		    device0.GUICOMMON_Key_Back(); //点击返回键关闭此提示
      	  		    Sleep(500);
      	  		    continue; //重新回到开始验证是否已进入首页
      	  	    } else if (imgVP("FIRST_START")) {
      	  		    NGLogger.Info("首次启动，尝试跳过介绍...");
      	  		    for (var i = 0; i < 5; i++) { //向左滑动5次屏幕以关闭介绍
      	  		        device0.GUICOMMON_Move(450, 400, 50, 400);
      	  		        Sleep(500);
      	  		    }
      	  		    device0.GUICOMMON_TouchScreen(400, 740); //点击马上体验
      	  		    Sleep(500);
      	  		    continue; //重新回到开始验证是否已进入首页
      	  	    } else if (imgVP("ERR_NETWORK")) {
      	  	       NGLogger.Info("网络错误，尝试刷新...");
                  device0.GUICOMMON_TouchScreen(240, 640); //点击刷新按钮
                  Sleep(3000); //给它时间刷新
                  continue; //重新回到开始验证是否已进入首页
      	  	    } else {
      	  	       if (i < 10) {Sleep(100); continue;}
      	  	       NGLogger.Error("E151:未知错误，启动失败，请查看截图");
      	  	       NGLogger.LogScreen(0);
      	  		} //end if, line 114
      	  	} // end for , line 120
    return false;
}
 

/** press BACK key until HOME
 *  param: Integer times [loop times]
 *  return: isHome <int to bool>
 */
function backToHome(times) { //Samsung I9108
	do {
		device0.GUICOMMON_Key_Back();
		Sleep(500);
	} while (!imgVP("LAUNCH_OK") && times--)
		//NGLogger.Warning("return:" +times);
	return times+1;
}


/** Log and Screenshot
 *  param: String Log
 *  return: 
 */
function logAndSnap(strLog) {
	NGLogger.LogScreen(0);
	NGLogger.UserLog("上图", strLog, "Purple");
}


/** Get screen size of device
 *  param: device id
 *  return: device screen size
 */
function getScreenSize(device) {
	return device.Basic_GetDeviceXPixel() + "_" + device.Basic_GetDeviceYPixel();
}