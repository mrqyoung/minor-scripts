/****************************************************************************************  
* 创建日期: 2013.07.31
* 作者: Yorn Wat
* 描述: com.aspire.mm [v3.8] performance-testing cases
****************************************************************************************/


// import
#region
#import "etc.js";
#import "lib.js";
#import "lib2.js";
//#import "../Common/ImageHelper.js";
#endregion


//测试次数
var TPtimes = 30;

//网络类型
var NWNAME = "wlan";	


// Variables
#region
var KEY_CODE_HOME = 3;		//HOME键的键值
#endregion


function AppMain() {//device0.GUICOMMON_Move(DOWN[0], DOWN[1], DOWN[2], DOWN[3]); Sleep(30000);
	for (var i = TPtimes; i--;){ NGLogger.Info("--------" + i + "--------");
		//startUp(clearCache=true);
		//startUp();
		listLoading(clearCache=true);
		//listLoading();
		//searchAndDetails(clearCache=true);
		//searchAndDetails();
		//download();
		//download2();
	} // 
}


//热启动时延（清除缓存 | 不清缓存）
function startUp(clearCache) {
	var caseName = '热启动时延（不清缓存）';
	//停止应用 <清除缓存>
	if (clearCache) {
		caseName = '热启动时延（清除缓存）';
		_log("应用内清除缓存");
		appClearCache();
		_log("系统内清除缓存");
		stopApp(clear = CLEAR_CACHE);
	} else exitApp(); //stopApp();
	//点击桌面图标启动应用
	click('APP_DESK_LLC');
	var ptTime = getPTtime('vp_Start');
	if (ptTime === 0) NGShell.Execute('cmd.exe', 'c:\tips.bat 0', false);
	csvOut(NWNAME, caseName, ptTime);
}


//应用列表页加载时延（清除缓存 | 不清缓存）
function listLoading(clearCache) {
	var caseName = '应用列表页加载时延（不清缓存）';
	//停止应用 <清除缓存>
	if (clearCache) {
		caseName = '应用列表页加载时延（清除缓存）';
		_log("应用内清除缓存");
		appClearCache();
		_log("系统内清除缓存");
		stopApp(clear = CLEAR_CACHE);
	} else stopApp();
	//启动应用
	startApp(PKG);
	_log("启动应用...");
	if (!waitFor('chk_Home')) {
		NGLogger.Error("失败－不能进入首页");
		logAndSnap(caseName + "－失败");
		return;
	}
	//计时
	click('MM_HOME_RJ');
	var ptTime = getPTtime('vp_AppList');
	csvOut(NWNAME, caseName, ptTime);
}


//应用搜索+详情页（清除缓存 | 不清缓存）
function searchAndDetails(clearCache) {
	var caseNameEnds = '（不清缓存）';
	//停止应用 <清除缓存>
	if (clearCache) {
		caseNameEnds = '（清除缓存）';
		_log("应用内清除缓存");
		appClearCache();
		_log("系统内清除缓存");
		stopApp(clear = CLEAR_CACHE);
	} else stopApp();
	//启动应用
	startApp(PKG);
	_log("启动应用...");
	if (!waitFor('chk_Home')) {
		NGLogger.Error("失败－不能进入首页");
		logAndSnap(caseName + "－失败");
		return;
	}
	
	//搜索
	var caseName = '搜索第三方应用的响应时延' + caseNameEnds;
	click('RJ_TJ_BTN_SS');
	_log("进入搜索"); Sleep(NORMAL);
	click('SS_TAG_RJ');
	_log("进入软件搜索分类"); Sleep(SHORT);
	click('SS_SRK');
	_log("点击搜索输入框"); Sleep(SHORT);
	device0.GUICOMMON_Text('fennudexiaoniao');
	Sleep(SHORT);
	click('INPUT_PY1');
	_log("输入关键词开始搜索..."); Sleep(NORMAL);
	click('BTN_SS'); //SS_LB1
	csvOut(NWNAME, caseName, getPTtime('vp_Search'));
//waitFor('chk_Search');
	//详情
	var caseName = '应用详情页加载时延' + caseNameEnds;
	if (!imgVP('chk_Search')) {
		NGLogger.Error("失败－无搜索结果");
		logAndSnap(caseName + "－失败");
		return;
	}
	_log("打开详情页...");
	click('SS_JG_XQ2');
	csvOut(NWNAME, caseName, getPTtime('vp_Details'));
	
	return; //单独测试下载
	//下载
	if (!clearCache) return;
	var caseName = '应用下载用时' + caseNameEnds;
	if (!imgVP('chk_Details')) {
		NGLogger.Error("失败－详情页未加载");
		logAndSnap(caseName + "－失败");
		return;
	}
	_log("开始下载...");
	click('GX_139');
	Sleep(10 * 1000);
	csvOut(NWNAME, caseName, getPTtime('vp_Download', 500) + 10 * 1000);
	//从应用管理里删除已下载的应用
	device0.GUICOMMON_Key_Back();
	Sleep(SHORT);
	click('BTN_YYGL');
	Sleep(NORMAL);
	click('MENU_1_OF_3'); 
	_log('进入下载任务'); Sleep(SHORT);
	click('YXZ_139');
	Sleep(SHORT);
	click('YXZ_SC');
	Sleep(SHORT);
	click('TSSCWJ');
	click('BTN_DIALOG_RIGHT');
	Sleep(SHORT);
	_log('已执行删除操作');
}


//下载
function download() {
	var caseName = '应用下载用时';
	if (!imgVP('chk_Details')) {
		NGLogger.Error("失败－详情页未加载");
		logAndSnap(caseName + "－失败");
		return;
	}
	_log("开始下载...");
	click('GX_139');
	Sleep(10 * 1000);
	csvOut(NWNAME, caseName, getPTtime('vp_Download', 200) + 10000);
	//从应用管理里删除已下载的应用
	if (imgVP('vp_Download')) device0.GUICOMMON_Key_Back();
	Sleep(SHORT);
	click('BTN_YYGL');
	Sleep(NORMAL);
	click('MENU_1_OF_3'); 
	_log('进入下载任务'); Sleep(SHORT);
	click('YXZ_139');
	Sleep(SHORT);
	click('YXZ_SC');
	Sleep(SHORT);
	click('TSSCWJ');
	Sleep(SHORT);
	click('BTN_DIALOG_RIGHT');
	Sleep(SHORT);
	_log('已执行删除操作');
	device0.GUICOMMON_Key_Back();
}


//下载
function download2() {
	var caseName = '应用下载用时';
	if (!imgVP('chk_Details')) {
		NGLogger.Error("失败－详情页未加载");
		logAndSnap(caseName + "－失败");
		return;
	}
	_log("开始下载...");
	
/* start loop */	
	var looptimes = 120;
	var timeStart = Date.now();
	var vp = NGVerifyPointManager.GetVerifyPoint("_720_1280\\vp_Download");
	click('GX_139');
	Sleep(20 * 1000);
    while (--looptimes) {
    	if (vp.DoVerify()) break;
    	Sleep(500);
    }
    dlTime = !looptimes || (Date.now() - timeStart - 3800); //fix if time too long (3.8s/cmp-time)
    NGLogger.Info("本次下载用时： " + dlTime);
	csvOut(NWNAME, caseName, dlTime);
	//从应用管理里删除已下载的应用
	if (imgVP('vp_Download')) device0.GUICOMMON_Key_Back();
	Sleep(SHORT);
	click('BTN_YYGL');
	Sleep(NORMAL);
	click('MENU_1_OF_3'); 
	_log('进入下载任务'); Sleep(SHORT);
	click('YXZ_139');
	Sleep(SHORT);
	click('YXZ_SC');
	Sleep(SHORT);
	click('TSSCWJ');
	Sleep(SHORT);
	click('BTN_DIALOG_RIGHT');
	Sleep(SHORT);
	_log('已执行删除操作');
	device0.GUICOMMON_Key_Back();
	Sleep(SHORT);
}
