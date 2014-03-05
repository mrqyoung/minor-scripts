/****************************************************************************************
* 创建日期: 2013.07.31
* 作者: Yorn Wat
* 描述: functions - For MM 3.8
****************************************************************************************/

#import "lib.js";


// 应用内清除缓存
function appClearCache() {
	//while (!imgVP('App_menu') && i--) device0.GUICOMMON_Key_Back();
	device0.GUICOMMON_Key_Menu();
	_log("启动菜单"); Sleep(1000);
	if (imgVP('App_menu')) {
		click('APP_MENU_SETS');
		_log("点击菜单中的设置按钮"); Sleep(1000);
		click('SETS_CLEAR_CACHE381');
		_log("点击设置中的清除缓存"); Sleep(1000);
		click('BTN_DIALOG_RIGHT');
		_log("确认清除缓存"); Sleep(1000);
	} else {
		//stopApp(0);
		startApp('com.aspire.mm');
		_log("重试应用内清除缓存"); Sleep(5000);
		appClearCache();
	}
}


// 删除下载的APK文件
function deleteDownladedApk() {
	startTestApp(PKG_MM);
	waitFor('MM_HOME');
	click('BTN_YYGL');
	Sleep(3000);
	if (!imgVP('YYGL')) {
		logAndSnap('进入应用管理失败');
		csvLog('进入应用管理失败');
	}
	click('MENU_1_OF_3'); _log('进入下载任务');
	try { TouchScreenByImage(device0, getPath('YXZ_139')); }
	catch (e) {click('YXZ_139');}
	Sleep(1000);
	click('YXZ_SC');
	Sleep(1000);
	click('TSSCWJ');
	click('BTN_DIALOG_RIGHT');
	Sleep(2000);
	_log('已执行删除操作');
	stopTestApp();
}


// 从菜单退出应用
function exitApp() {
	device0.GUICOMMON_Key_Menu();
	_log("启动菜单"); Sleep(1000);
	if (imgVP('App_menu')) {
		click('APP_MENU_EXIT');
		_log("点击菜单中的退出按钮"); Sleep(1000);
		click('EXIT_EXIT');
		_log("确认退出"); Sleep(1000);
	}
}