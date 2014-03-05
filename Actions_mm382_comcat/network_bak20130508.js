/****************************************************************************************
* 创建日期: 8-May-2013		* 作者: Yorn Wat
* 描述: network check/change
****************************************************************************************/



var CMCC = 1, TD = 2, EDGE = 3;
var MM_PACKAGENAME = 'com.aspire.mm';


function AppMain(){networkCheck() ;
	var aaa = { AAA:1, BBB:2, CCC:3}
	for (var key in aaa)
		NGLogger.Info(aaa[key] + '/' + key);
//	NGGDExcel.LoadExcelTemplate('C:\\t.xls');
}


//预置
function preset() {
}


//当前网络状态检测，返回 {CMCC / TD / EDGE}
function networkCheck() {
	var NETWORK = CMCC;
	if (NGVerifyPointManager.GetVerifyPoint("NW\\H").DoVerify()) NETWORK = TD;
	else if (NGVerifyPointManager.GetVerifyPoint("NW\\E").DoVerify()) NETWORK = EDGE;
	NGLogger.Warning('当前网络为 【' + ['NULL', 'CMCC', 'TD', 'EDGE'][NETWORK] + '】');
	return NETWORK;
}


//连接到CMCC
function toCMCC() {
	NGLogger.Info('启动随e行');
	device0.GUICOMMON_StartByPackageName('com.chinamobile.cmccwifi'); //启动随e行
	Sleep(6000);
	NGLogger.Info('连接到CMCC');
	device0.GUICOMMON_TouchScreen(240, 240); //点击第一个网络 CMCC
	Sleep(5000);
	var maxLoopTimes = 10;
	while (--maxLoopTimes) {
//		if (NGVerifyPointManager.GetVerifyPoint("NW\\TIP").DoVerify()) device0.GUICOMMON_Key_Back();
		if (NGVerifyPointManager.GetVerifyPoint("NW\\CMCC_LOGIN").DoVerify()) break;
		Sleep(2000);
	}
//	if (NGVerifyPointManager.GetVerifyPoint("NW\\TIP").DoVerify()) device0.GUICOMMON_Key_Back();
	Sleep(1000);
	NGLogger.Info('登录CMCC');
	device0.GUICOMMON_TouchScreen(240, 600); //点击登录
	Sleep(3000);
	maxLoopTimes = 10;
	while (--maxLoopTimes) {
		if (NGVerifyPointManager.GetVerifyPoint("NW\\CMCC_OK").DoVerify()) {
		NGLogger.Info('＝ CMCC已连接 ＝');
		device0.GUICOMMON_Key_Home();
		Sleep(500);
		return true;
	    }
	}
	
	NGLogger.Error(' CMCC 连接失败！');
	return false;
}


//断开CMCC（关闭WLAN）
function closeCMCC() {
	NGLogger.Info('启动随e行');
	device0.GUICOMMON_StartByPackageName('com.chinamobile.cmccwifi'); //启动随e行
	Sleep(5000);
	//if (NGVerifyPointManager.GetVerifyPoint("NW\\CMCC_OK").DoVerify()) {
		NGLogger.Info('断开CMCC并关闭WIFI');
		device0.GUICOMMON_Key_Menu();
		Sleep(1000);
		device0.GUICOMMON_TouchScreen(360, 760); //点击[退出]CMCC
		Sleep(1000);
		device0.GUICOMMON_TouchScreen(160, 520); //点击[是]退出CMCC并关闭WIFI
		Sleep(10000);
/*		if (NGVerifyPointManager.GetVerifyPoint("NW\\TIP").DoVerify()) {
			NGLogger.Info('连接数据网络');
			device0.GUICOMMON_TouchScreen(150, 530); //点击[连接]数据网络
			Sleep(5000);
		} */
	//} else NGLogger.Error(' CMCC 未连接！');
	networkCheck();
}


//选择 TD 或者 EDGE 网络，根据参数
function changeBAND(NWtogo) {
	if (networkCheck() == CMCC) closeCMCC();
	//打开ServiceMode准备切换网络
	startServiceMode();
	
	var TOGO_Y = (NWtogo == TD) ? 180 : 220; //180 = [2] TDSCDMA BAND[]; 220 = [3] GSM BAND[]
	device0.GUICOMMON_TouchScreen(240, TOGO_Y); //点击 一个 BAND[]
	Sleep(1000);
	device0.GUICOMMON_TouchScreen(240, 140); //点击 ..ALL[]
	Sleep(1000);
	device0.GUICOMMON_Key_Back();
	NGLogger.Info('操作已完成，等待网络切换...');
	Sleep(10000);
	if (networkCheck() != NWtogo) {
		NGLogger.Warning('网络切换失败，重试...');
		changeBAND(NWtogo);
	} else {
		NGLogger.Info('网络切换成功');
	}
}


//输入暗码打开 ServiceMode
// com.sec.android.app.servicemodeapp/com.sec.android.app.servicemodeapp.ServiceModeApp
function startServiceMode() {
	NGLogger.Info('准备打开ServiceMode以便切换网络...');
	device0.GUICOMMON_Key_Home();
	Sleep(1000);
	device0.GUICOMMON_TouchScreen(60, 720); //点击主屏幕的拨号图标打开拨号
	Sleep(1000);
	device0.GUICOMMON_Text('*#0011#');
	Sleep(1000);
	NGLogger.Info('已打开ServiceMode');
	device0.GUICOMMON_Key_Menu();
	Sleep(1000);
	device0.GUICOMMON_Key_Dpad_Right();
	Sleep(1000);
	device0.GUICOMMON_Key_Enter();
	//device0.GUICOMMON_TouchScreen(460, 640); //点击菜单的Back
	Sleep(1000);
	device0.GUICOMMON_TouchScreen(240, 440); //点击 [8] PHONE CONTROL
	Sleep(1000);
	device0.GUICOMMON_TouchScreen(240, 390); //点击 [7] NETWORK CONTROL
	Sleep(1000);
	device0.GUICOMMON_TouchScreen(240, 180); //点击 [2] BAND SELECTION
	Sleep(1000);
	NGLogger.Info('已进入 ＝BAND SELECTION＝');
}


#region
// TD 切换到　EDGE
function TD2EDGE() {
	//打开ServiceMode准备切换网络
	startServiceMode();
	device0.GUICOMMON_TouchScreen(240, 220); //点击 [3] GSM BAND[]
}


// EDGE 切换到　TD
function EDGE2TD() {
	//打开ServiceMode准备切换网络
	startServiceMode();
	device0.GUICOMMON_TouchScreen(240, 140); //点击 [1] AUTOMATIC[]
}
#endregion