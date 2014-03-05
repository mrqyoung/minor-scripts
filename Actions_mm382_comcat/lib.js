/****************************************************************************************
* 创建日期: 2013.07.31
* 作者: Yorn Wat
* 描述: functions
****************************************************************************************/


#region
//[CSV] e.g: 点击应用图标启动应用, 2013-07-07 09:00
function csvLog(strLog) {
	NGLogger.UserLog('LOG', strLog, 'BlueViolet');
	var logTime = getLogTime();
	var strOut = strLog + ',' + logTime;
	NGShell.Execute('cmd.exe', '/c echo ' + strOut + '>>c:\\_0.csv', true);
}


function getLogTime() {
	var d = new Date();
	var fixDigit = function(i) {return i < 10 ? '0' + i : i; };
	return d.getFullYear() + '-' + (d.getMonth()+1) + '-' + d.getDate() + ' ' + 
			fixDigit(d.getHours()) + ':' + 
			fixDigit(d.getMinutes()) + ':' + 
			fixDigit(d.getSeconds());
}


//[CSV] e.g: EDGE, 首次启动, 12000, 2013-05-09 09:00
function csvOut(network, caseName, ptTime) {
	var strOut = network + ',' + caseName + ',' + ptTime + ',' + getLogTime();
	NGShell.Execute('cmd.exe', '/c echo ' + strOut + '>>c:\\pt_mm_0.csv', true);
	return ptTime;
}
#endregion


//屏幕座标点击
function click(point) {
	var arrPoint = eval(NS + '.' + point);// this[NS][point]
	device0.GUICOMMON_TouchScreen(arrPoint[0], arrPoint[1]);
}


//根据名称找到图片路径
function getPath(imgName) {
	//SCREEN_SIZE = SCREEN_SIZE || '0';
	if (!NS) {
		NS = getScreenSize(device0);
		_log("当前device0的命名空间：" + NS);
	}
	return NS + '\\' + imgName;
}

     
//图片验证，返回与目标图片对比的结果boolean是否匹配
function imgVP(imgName) {
	var imgPath = getPath(imgName);
	_log("VP: " + imgPath);
	return NGVerifyPointManager.GetVerifyPoint(imgPath).DoVerify();
}


//启动应用程序
function startApp(packageName) {
	device0.GUICOMMON_Key_Home();
	Sleep(1000);
	_log("Home now");
	device0.GUICOMMON_StartByPackageName(packageName);
	_log("Starting App: " + packageName);
	Sleep(5000);
}


/** Kill app process, and clear data if asked
 *  param: boolean clearData [True=clear|False=skip]
 *  return: boolean MMStoped
 */
function stopApp(clear) { //Samsung I9308
	_log("从应用程序管理里关闭应用");
	device0.GUICOMMON_StartByPackageName(PKG_ASSI);
    _log("打开管理应用程序");
    Sleep(10000);
    var buttons = ['BTN_FORCESTOP', 'BTN_CLEAR_DATA', 'BTN_CLEAR_CACHE'];
    if (clear) {//清除数据
      click(buttons[clear]); //点击某一个清除按钮
      _log("点击强制停止");
	  Sleep(1000);
	  click('BTN_DIALOG_RIGHT'); //会出现清除数据或者强制停止的确认窗口，点击确认
	  Sleep(1000);
    }
	//停止应用
	click(buttons[FORCE_STOP]); //点击强制停止
    _log("点击强制停止");
	Sleep(1000);
	click('BTN_DIALOG_RIGHT'); //会出现清除数据或者强制停止的确认窗口，点击确认
	Sleep(500);
	if (imgVP('APP_STOPED')) {
		NGLogger.Info("应用程序已停止");
		device0.GUICOMMON_Key_Back();
		Sleep(1000);
		return true;
	} else {device0.GUICOMMON_Key_Back();
		device0.GUICOMMON_Key_Home();
		Sleep(1000);
		return false;
	}
    return false;
}


// 等待验证点出现
function waitFor(imgName, waitTime) {
	var loopTimes = waitTime || 10;
	var ImageObject = NGVerifyPointManager.GetVerifyPoint(getPath(imgName));
	while (--loopTimes) {
		if (ImageObject.DoVerify()) {return true;}
		_log("等待验证点[" + imgName + "]出现...");
		Sleep(1000);
	}
	return false;
}


//根据图片验证点获取操作过程耗时（ms）
function getPTtime(imgName, imgCount) {
	imgCount = imgCount || 200;
	var interval = 200;
	imgCount /= (interval / 100);
	var imgPath = getPath(imgName);
	arrVP = NGVerifyPointManager.GetVerifyPointRegion(imgPath);
	NGLogger.Info("开始截图图片，大约30秒，请等待……");
	device0.Basic_StartAppMonitorService(imgCount, interval, arrVP[0], arrVP[1], arrVP[2], arrVP[3]);
	//参数：预估整个启动过程中需要的截图次数。每秒5次(即100ms一次，误差范围也为100ms)此接口会一直执行10s
	NGLogger.Info("已完成截图，开始进行图片比对，无尽的等待……");
	device0.Basic_GetAppStartDuration(); //将图片从sdcard拷贝到本地硬盘。固定目录：bin\AppStartTemp
	//通过图片比对返回启动时间
	var operationTime = NGVerifyPointManager.GetVerifyPoint(imgPath).GetAppStartDuration(0, 0, 0, 0);
	NGLogger.Info("本次操作时间："+ operationTime/1000 + "s");
	return operationTime;
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
	return '_' + device0.Basic_GetDeviceXPixel() + '_' + device0.Basic_GetDeviceYPixel();
}

function perset() {
	NS = '_' + device0.Basic_GetDeviceXPixel() + '_' + device0.Basic_GetDeviceYPixel();
 };


// Debug-Logs
function _log(strLog) {
	NGLogger.UserLog('Debug', strLog, 'DarkGray');
	return;
}