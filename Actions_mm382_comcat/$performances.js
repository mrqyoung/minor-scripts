/****************************************************************************************
* 创建日期: 15-Mar-2013
* 作者: Yorn Wat
* 描述: performance test module
*
* 修改日期:
* 修改人:
* 描述: (运行条件:1.MM图标放在桌面左下角位置2.输入法为三星中文3.进入程序管理的MM应用管理并使其位于后台第2)
*		DeviceResourceChart.DownloadSpeed = 16 ; ALL = 115
*
****************************************************************************************/

//#import "functions.js";
//#import "ActionCollection.js";
#import "constants.js";
#import "../Common/ImageHelper.js";


//测试次数
var TPtimes = 3;

//网络类型
var NWNAME = 'NULL';

var imgVP = function(imgPath) {return NGVerifyPointManager.GetVerifyPoint(imgPath).DoVerify();};
var KEY_CODE_HOME = 3;		//HOME键的键值
var CLEAR_DATA = 0;		//清除数据
var FORCE_STOP = 1;		//停止而不做任何清除
var CLEAR_CACHE = -1;		//清除缓存
var DIFF_APP = 0;			//搜索和详情需要使用的3个不同APP标志位

//网络的原因导致截图张数需要改动
var SNAP_RATIO = 1;
var SNAP = function(times) {return times * SNAP_RATIO;};


//本模块的启动入口函数
function AppMain(){
	NGLogger.UserLog("开始", "==MM性能测试== ...............次数："+ TPtimes, 'Green');
	pt(PTfirstTab, '无缓存标签页加载');
	pt(PTfirstStart, '首次启动');
	pt(PTnormalStart, '有缓存启动');
	pt(PTappsDetails, '无缓存详情页加载');		// x3
	pt(PTsearchApp, '无缓存应用搜索(软件)');		// x3
	pt(PTdownload, '应用下载');
	NGLogger.UserLog("结束", "==MobileMarket性能测试==", 'Green'); NGShell.Execute('..\\mrqyoung\\tips.bat', 0, 1);
}
/**未使用的用例--
	pt(PTnoCacheStart, '无缓存启动');
	pt(PTnormalTab, '有缓存标签页加载');
	pt(PTappDetails, '无缓存详情页加载');
	pt(PTsearchAll, '无缓存应用搜索(全部)');
	pt(PTexit, '退出');
	pt(PTdownload, '应用下载'); //bad
***/


//重复执行用例并计算平均时间
function pt(caseFunc, caseName) {
	NGLogger.UserLog('PT', caseName, 'BlueViolet');
	var arrTime = new Array();
//	var maxLoopTimes = 5;
	for (var i = 0; i < TPtimes; i++) {
		NGLogger.Info('第' + (i+1) + '次测试--' + caseName);
		arrTime[i] = caseFunc();
		NGLogger.Warning('Debug: ' + arrTime[i]);
//		if (!maxLoopTimes--) {break;}
//		if (!arrTime[i]) { --i; NGShell.Execute('..\\mrqyoung\\tips.bat', 1, 1);}
	}
	
	//avgTime(arrTime); 
	//不计算平均值了，直接输出每次执行时间，手动去统计结果－20130321
	for (var j in arrTime) {
		//NGLogger.UserLog(caseName,  '第'+ (parseInt(j)+1) +'次用时(ms)：' + arrTime[j] , 'BlueViolet');
		var k = parseInt(j)+1;
		var times = k < 10 ? ('0' + k) : k;
		NGLogger.UserLog(caseName,  '第'+ times +'次用时(ms)：' + arrTime[j] , 'BlueViolet');
	}
}

//计算平均值
function avgTime(arrTime) {
	var sumTime = 0;
	var sumLen = 0;
	for (var i in arrTime) {
		if (arrTime[i] > 0) {
			sumTime += arrTime[i];
			sumLen ++;
		}
	}
	NGLogger.Info('sum:' + sumTime + ' , len:' +sumLen);
	//NGLogger.UserLog('PT', caseName + sumLen +'次平均耗时(ms)：' + sumTime / sumLen, 'BlueViolet');
}


/*PERFORMANCE TEST*/
      	  
//首页首次加载(清除数据)
function PTfirstStart() {  //10359是错误值
	NGLogger.Info('1.清除数据');
	quickerStopClear(CLEAR_DATA); //清除数据
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	//device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	device0.GUICOMMON_TouchScreen(60, 540);
	var timeStartPoint = new Date();
	NGLogger.Info('3.开始监测');
	//device0.GUICOMMON_Move(TZL[0], TZL[1], TZL[2], TZL[3]); //滑动下拉通知栏监视启动情况, 68
	//return performanceOversee('PT\\FirstStart_1', [300, 12, 488, 116, 99]);//[次数, l,t,w,h]
	
	var looptimes = 10;
	do {Sleep(100);} while (!imgVP("480_800\\FIRST_START") && looptimes--); //等待Splash出现
	for (var i = 0; i < 4; i++) { //向左滑动4次屏幕以关闭介绍
		device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次
		Sleep(TINY);
    }
	device0.GUICOMMON_TouchScreen(MSTY[0], MSTY[1]); //点击马上体验, 38
	var ptTime = new Date() - timeStartPoint;
	var oTime = performanceOversee('PT\\FirstStart', [SNAP(300), 20, 340, 21, 432]);//[次数, l,t,w,h]
	if (oTime == 100) { oTime -= 3000; } //fix-20130425
	return oTime && oTime + ptTime;
}


//无缓存启动
function PTnoCacheStart() {
	NGLogger.Info('1.清除缓存并停止MM');
	quickerStopClear(CLEAR_CACHE); //清除缓存并停止
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	//device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	device0.GUICOMMON_TouchScreen(60, 540);
	NGLogger.Info('3.开始监测');
	var normalStartTime = performanceOversee('PT\\FirstStart', [SNAP(200), 20, 340, 21, 432]);//[次数, l,t,w,h]
	
	//可能仍然会显示splash页
	if (normalStartTime == 0) {
      	skipSplash();
	}
	return normalStartTime;
}


//启动(首页加载, 不清除缓存)
function PTnormalStart() {
	NGLogger.Info('1.清除缓存并停止MM');
	quickerStopClear(FORCE_STOP); //停止
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	//device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	device0.GUICOMMON_TouchScreen(60, 540);
	NGLogger.Info('3.开始监测');
	var normalStartTime = performanceOversee('PT\\FirstStart', [SNAP(200), 20, 340, 21, 432]);//[次数, l,t,w,h]
	
	//可能仍然会显示splash页
	if (normalStartTime == 0) {
      	skipSplash();
	}
	return normalStartTime;
}


//无缓存标签页加载tab
function PTfirstTab() {
	NGLogger.Info('1.停止MM并清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22 
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('点击软件tab页并监控加载时间');
    	device0.GUICOMMON_TouchScreen(60, 340); //点击进入“软件”
    	Sleep(NORMAL);
    	device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次,进入“最新”
    	return performanceOversee('PT\\TabAppNew', [SNAP(100), 39, 137, 12, 649]);//[次数, l,t,w,h]
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


//有缓存标签页加载tab
function PTnormalTab() {
	NGLogger.Info('1.停止MM');
	quickerStopClear(FORCE_STOP); //停止
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('点击一个tab并记录时间');
    	device0.GUICOMMON_TouchScreen(60, 340); //点击进入“软件”
    	Sleep(NORMAL);
    	device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次,进入“最新”
    	return performanceOversee('PT\\TabAppNew', [SNAP(100), 39, 137, 12, 649]);//[次数, l,t,w,h]
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


//无缓存详情页加载(单个应用)
function PTappDetails() {
	NGLogger.Info('1.清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	device0.GUICOMMON_TouchScreen(60, 340); //点击进入“软件”
    	Sleep(NORMAL);

    	var iApp = DIFF_APP % 3;
    	DIFF_APP++;
    	var arrApps = new Array(
    		[700, 'AppDetails1'],
    		[600, 'AppDetails2'],
    		[500, 'AppDetails3']
    	);
    	NGLogger.Info('点击当前屏幕的一个应用并记录时间#' + DIFF_APP);
    	device0.GUICOMMON_TouchScreen(240, arrApps[iApp][0]); //20130329酷我音乐播放器,灵犀,墨迹天气
    	return performanceOversee('PT\\' + arrApps[iApp][1], [SNAP(150), 60, 140, 20, 330]);
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


//无缓存详情页加载(三个应用)
function PTappsDetails() {
	NGLogger.Info('1.清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	device0.GUICOMMON_TouchScreen(60, 340); //点击进入“软件”
    	Sleep(NORMAL);

    	var ptTime = '';
    	NGLogger.Info('点击一个应用并记录时间#1');
    	device0.GUICOMMON_TouchScreen(240, 700); //20130417墨迹天气
    	ptTime = performanceOversee('PT\\AppDetails1', [SNAP(100), 80, 180, 180, 260]);
    	Sleep(TINY);
    	
    	NGLogger.Info('点击一个应用并记录时间#2');
    	device0.GUICOMMON_Key_Back(); //返回上一页
    	Sleep(SHORT);
    	device0.GUICOMMON_TouchScreen(240, 600); //20130417taobao
    	ptTime += '$' + performanceOversee('PT\\AppDetails2', [SNAP(100), 80, 180, 180, 260]);
    	Sleep(TINY);
    	
    	NGLogger.Info('点击一个应用并记录时间#3');
    	device0.GUICOMMON_Key_Back(); //返回上一页
    	Sleep(SHORT);
    	device0.GUICOMMON_TouchScreen(240, 500); //20130417gushihui
    	ptTime += '$' + performanceOversee('PT\\AppDetails3', [SNAP(100), 80, 180, 180, 260]);
    	
    	return ptTime;
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


//无缓存应用搜索(全部)
function PTsearchAll() {
	NGLogger.Info('1.清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('当前为首页，进入搜索');
    	device0.GUICOMMON_TouchScreen(SS[0], SS[1]); //搜索按钮, 77
    	Sleep(SHORT);
    	//device0.GUICOMMON_TouchScreen(SSFL[0][0], SSFL[0][1]); //搜索分类-软件, 99
    	Sleep(SHORT);
    	//点击搜索框、输入关键字、进行搜索
      	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
      	Sleep(TINY);
      
      	var iApp = DIFF_APP % 3;
      	DIFF_APP++;
    	var arrApps = new Array(
    		['qq', 'SearchQQ'],
    		['daohang', 'SearchDH'],
    		['anquan', 'SearchAQ']
    	);
      	NGLogger.Info('准备搜索#' + DIFF_APP + arrApps[iApp][1]);
      	device0.GUICOMMON_Text(arrApps[iApp][0]); //输入的搜索关键字
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(60, 430); //点击输入法的第1个候选词
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	return performanceOversee('PT\\' + arrApps[iApp][1], [SNAP(100), 20, 60, 210, 200]);
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


//无缓存应用搜索(软件：QQ、导航、安全)
function PTsearchApp() {
	NGLogger.Info('1.清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('当前为首页，进入搜索');
    	device0.GUICOMMON_TouchScreen(SS[0], SS[1]); //搜索按钮, 77
    	Sleep(SHORT);
    	device0.GUICOMMON_TouchScreen(SSFL[0][0], SSFL[0][1]); //搜索分类-软件, 99
    	Sleep(SHORT);
    	//点击搜索框、输入关键字、进行搜索
      	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
      	Sleep(TINY);
      
      	var ptTime = '';
      	NGLogger.Info('准备搜索QQ');
      	device0.GUICOMMON_Text('qq'); //输入的搜索关键字qq
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(SRFWC[0], SRFWC[1]); //中文输入法，需要点确定, 86
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime = performanceOversee('PT\\SearchQQ', [SNAP(200), 20, 210, 20, 500]);
    	Sleep(TINY);
    	
    	NGLogger.Info('准备搜索导航');
    	device0.GUICOMMON_TouchScreen(310, 150); //清除搜索关键词
    	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
    	Sleep(TINY);
      	device0.GUICOMMON_Text('daohang'); //输入的搜索关键字导航
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(60, 430); //点击输入法的第1个候选词
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime += '$'+ performanceOversee('PT\\SearchDH', [SNAP(200), 20, 210, 20, 500 ]);
    	Sleep(TINY);
    	
    	NGLogger.Info('准备搜索安全');
    	device0.GUICOMMON_TouchScreen(310, 150); //清除搜索关键词
    	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
    	Sleep(TINY);
      	device0.GUICOMMON_Text('anquan'); //输入的搜索关键字安全
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(60, 430); //点击输入法的第1个候选词
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime += '$'+ performanceOversee('PT\\SearchAQ', [SNAP(200), 20, 210, 20, 500 ]);
    	
    	return ptTime;
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}


/// <summary>
/// 无缓存_应用_搜索_++详情页 (软件：QQ、导航、安全)
/// </summary>
function PTsearchAndDetails() {
	NGLogger.Info('1.清除缓存');
	quickerStopClear(CLEAR_CACHE); //清除缓存
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('当前为首页，进入搜索');
    	device0.GUICOMMON_TouchScreen(SS[0], SS[1]); //搜索按钮, 77
    	Sleep(SHORT);
    	device0.GUICOMMON_TouchScreen(SSFL[0][0], SSFL[0][1]); //搜索分类-软件, 99
    	Sleep(SHORT);
    	//点击搜索框、输入关键字、进行搜索
      	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
      	Sleep(TINY);
      
      	var ptTime = [0, 0, 0, 0, 0, 0];
      	NGLogger.Info('准备搜索QQ');
      	device0.GUICOMMON_Text('qq'); //输入的搜索关键字qq
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(SRFWC[0], SRFWC[1]); //中文输入法，需要点确定, 86
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime[0] = performanceOversee('PT\\SearchQQ', [SNAP(200), 20, 210, 20, 500]);
    	Sleep(TINY);
    	/// <summary>
    	/// 详情一：手机QQ2013
    	/// </summary>
    	NGLogger.Info('点击[手机QQ2013]并记录时间#1');
    	device0.GUICOMMON_TouchScreen(240, 260); //手机QQ2013
    	ptTime[1] = performanceOversee('PT\\SS_SJQQ2013', [SNAP(220), 73, 175, 224, 337]);
    	device0.GUICOMMON_Key_Back();
    	Sleep(TINY);
    	
    	NGLogger.Info('准备搜索导航');
    	device0.GUICOMMON_TouchScreen(310, 150); //清除搜索关键词
    	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
    	Sleep(TINY);
      	device0.GUICOMMON_Text('daohang'); //输入的搜索关键字导航
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(60, 430); //点击输入法的第1个候选词
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime[2] = performanceOversee('PT\\SearchDH', [SNAP(200), 20, 210, 20, 500 ]);
    	Sleep(TINY);
    	/// <summary>
    	/// 详情二：中国移动手机导航
    	/// </summary>
    	NGLogger.Info('点击[中国移动手机导航]并记录时间#2');
    	device0.GUICOMMON_TouchScreen(240, 260); //中国移动手机导航
    	ptTime[3] = performanceOversee('PT\\SS_ZGYDSJDH', [SNAP(220), 60, 170, 199, 276]);
    	device0.GUICOMMON_Key_Back();
    	Sleep(TINY);
    	
    	NGLogger.Info('准备搜索安全');
    	device0.GUICOMMON_TouchScreen(310, 150); //清除搜索关键词
    	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
    	Sleep(TINY);
      	device0.GUICOMMON_Text('anquan'); //输入的搜索关键字安全
      	Sleep(TINY);
      	device0.GUICOMMON_TouchScreen(60, 430); //点击输入法的第1个候选词
      	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
    	ptTime[4] = performanceOversee('PT\\SearchAQ', [SNAP(200), 20, 210, 20, 500 ]);
    	Sleep(TINY);
    	/// <summary>
    	/// 详情三：360安全浏览器
    	/// </summary>
    	NGLogger.Info('点击[360安全浏览器]并记录时间#3');
    	device0.GUICOMMON_TouchScreen(240, 260); //360安全浏览器
    	ptTime[5] = performanceOversee('PT\\SS_360AQLLQ', [SNAP(220), 72, 168, 216, 268]);
    	Sleep(TINY);
    	
    	return ptTime;
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}

 

//下载应用速率
function PTdownload() {
	NGLogger.Info('1.清除数据');
	quickerStopClear(CLEAR_DATA); //清除数据
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //使用包名启动应用, 22
	Sleep(WHILE);
	
	var looptimes = 10;
	do {Sleep(500)} while (!imgVP("480_800\\FIRST_START") && looptimes--); //等待Splash出现
	for (var i = 0; i < 4; i++) { //向左滑动4次屏幕以关闭介绍
		device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次
		Sleep(TINY);
    }
	device0.GUICOMMON_TouchScreen(MSTY[0], MSTY[1]); //点击马上体验, 38
	if (!imgVP("480_800\\LAUNCH_OK") && !fixBadStart()) {
		NGLogger.Warning('本次测试下载失败：不能进入首页');
		return 0;
	}
	NGLogger.Info("当前为MM首页");
	
	//点击首页顶部中央的搜索按钮进入搜索页面
      	  	device0.GUICOMMON_TouchScreen(SS[0], SS[1]); //搜索按钮, 77
      	  	NGLogger.Info("进入搜索页面");
      	  	Sleep(SHORT);
      	  	device0.GUICOMMON_TouchScreen(SSFL[0][0], SSFL[0][1]); //搜索分类-软件, 99
      	  	Sleep(LONG);
      	  	//点击搜索框、输入关键字、进行搜索
      	  	device0.GUICOMMON_TouchScreen(SSSRK[0], SSSRK[1]); //搜索输入框, 80
      	  	Sleep(SHORT);
      	  	device0.GUICOMMON_Text('139'); //输入的搜索关键字
      	  	Sleep(TINY);
      	  	//device0.GUICOMMON_TouchScreen(60, 430); //点击输入法得到的第一个词
      	  	//Sleep(TINY);
      	  	device0.GUICOMMON_TouchScreen(SSAN[0], SSAN[1]); //点击搜索按钮, 89
      	  	Sleep(LONG);
      	  	NGLogger.Info("显示搜索结果");
      	  	
    //执行下载动作并监测时间  	  	
	NGLogger.Info('开始应用下载');
	var dlTime = 0;
    var sleepTime = 5000; //休眠时间
    var timeStartPoint = new Date();
    device0.GUICOMMON_TouchScreen(400, 540); //点击结果中的第一条，开始下载
    
    if (sleepTime) Sleep(sleepTime); //var t=new Date(); NGLogger.Info("xxx"+(new Date() - t));
    
    var looptimes = 120;
    while (--looptimes) {
    	if (NGVerifyPointManager.GetVerifyPoint("PT\\CY_download").DoVerify()) break;
    	Sleep(500);
    }
    
    dlTime = !looptimes || (new Date() - timeStartPoint - 3800); //fix if time too long (3.8s/cmp-time)
//    NGLogger.Info("???-"+looptimes);  	  	
    NGLogger.UserLog('下载', '139邮箱[3023KB] 用时(ms)：' + dlTime, 'Green'); //3,095,203 bytes
    device0.GUICOMMON_Key_Back(); //按返回键关闭程序安装器
    Sleep(TINY);

	return dlTime;
}


//退出
function PTexit() {
	NGLogger.Info('1.停止MM');
	quickerStopClear(FORCE_STOP); //停止
	Sleep(SHORT);
	NGLogger.Info('2.启动应用');
	device0.GUICOMMON_StartByPackageName(MM_PACKAGENAME); //包名, 22  
	Sleep(WHILE);
	
    //检查当前是否为首页
    if (imgVP("480_800\\LAUNCH_OK") || fixBadStart()) {
    	NGLogger.Info('已确认当前为首页，准备退出');
    	device0.GUICOMMON_Key_Back(); //按下返回键
    	Sleep(TINY);
    	device0.GUICOMMON_TouchScreen(140, 340); //点击退出提示的确认退出按钮
    	return performanceOversee('480_800\\HOME', [SNAP(50), 396, 708, 50, 53]);//[次数, l,t,w,h]
    } else {
    	NGLogger.Warning('启动过程可能失败，放弃');
    }
	return 0;
}



/*END OF PERFORMANCE-TEST*/


/** the performance of an operation
 *
 */
function performanceOversee(imgName, arrVP) {
	NGLogger.Info("开始截图图片，大约30秒，请等待……");
	device0.Basic_StartAppMonitorService(arrVP[0], arrVP[1], arrVP[2], arrVP[3], arrVP[4]);
	//参数：预估整个启动过程中需要的截图次数。每秒5次(即100ms一次，误差范围也为100ms)此接口会一直执行10s
	NGLogger.Info("已完成截图，开始进行图片比对，大约30秒，请耐心等待……");
	device0.Basic_GetAppStartDuration(); //将图片从sdcard拷贝到本地硬盘。固定目录：bin\AppStartTemp
	//通过图片比对返回启动时间
	var operationTime = NGVerifyPointManager.GetVerifyPoint(imgName).GetAppStartDuration(0, 0, 0, 0);
	NGLogger.Info("本次操作时间："+operationTime/1000+"s");
	return operationTime;
}


/** Stop or Clear-data by long click HOME
 *
 */
function quickerStopClear(clearType) { //CLEAR_DATA = 0;  FORCE_STOP = 1;  CLEAR_CACHE = -1;
	device0.GUICOMMON_KeyPress(KEY_CODE_HOME, 2000); //长按HOME键, HOME_keyCode = 3
	Sleep(SHORT);
	try {
		TouchScreenByImage(device0, "PT\\QuickerSet"); //根据图片验证点来点击设定按钮去到程序管理页
	} catch (exception) {
		NGLogger.Info('根据图片位置来点击失败了，只能使用第二个图标');
		device0.GUICOMMON_TouchScreen(240, 300); //点击最近使用程序的第一排第二个
	}
	Sleep(SHORT);
	if (clearType == -1) {
		device0.GUICOMMON_TouchScreen("350","640"); //点击清除缓存
    	NGLogger.Info("点击清除缓存"); 
	}
	Sleep(TINY);
	if (clearType) {
		device0.GUICOMMON_TouchScreen("120","180"); //点击强制停止
    	NGLogger.Info("点击强制停止"); 
    } else {
    	device0.GUICOMMON_TouchScreen("120","480"); //点击清除数据
        NGLogger.Info("点击清除数据");
    }  //会出现清除数据或者强制停止的确认窗口
	Sleep(SHORT);
	device0.GUICOMMON_TouchScreen("120","510"); //点击确认
	Sleep(TINY);
	if (NGVerifyPointManager.GetVerifyPoint("480_800\\MM_STOPED").DoVerify()) {
		NGLogger.Info("MM已停止");
		device0.GUICOMMON_Key_Home();
		Sleep(TINY);
		return true;
	} else {
		NGLogger.Error("快捷停止或清除数据失败");
		//stopMM(clearData);
	}
	return false;
}


/** fix bad start: start with a splash activiey, like new.
 *
 */
function fixBadStart() {
      	  		if (imgVP("480_800\\LAUNCH_OK")) {
      	  		    NGLogger.Info("移动MM启动----OK");
      	  		    return true;
      	  		} else NGLogger.Info("Fix bad start......");
      	  		if (imgVP("480_800\\HINT_NEW")) {
      	  		    NGLogger.Info("出现手机很新的温馨提示");
      	  		    device0.GUICOMMON_Key_Back(); //点击返回键关闭此提示
      	  		    fixBadStart(); //重新回到开始验证是否已进入首页
      	  	    } else if (imgVP("480_800\\FIRST_START")) {
      	  		    NGLogger.Info("首次启动，尝试跳过介绍...");
      	  		    for (var i = 0; i < 5; i++) { //向左滑动5次屏幕以关闭介绍
      	  		        device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次
      	  		        Sleep(TINY);
      	  		    }
      	  		    device0.GUICOMMON_TouchScreen(MSTY[0], MSTY[1]); //点击马上体验, 38
      	  		    Sleep(TINY);
      	  		    fixBadStart(); //重新回到开始验证是否已进入首页
      	  	    } else if (imgVP("480_800\\ERR_NETWORK")) {
      	  	       NGLogger.Info("网络错误，尝试刷新...");
      	  	       device0.GUICOMMON_TouchScreen(SX[0], SX[1]); //点击刷新按钮, 41
                  Sleep(NORMAL); //给它时间刷新
                  fixBadStart(); //重新回到开始验证是否已进入首页
      	  	    } else {
					if (imgVP("480_800\\LAUNCH_OK")) {
						NGLogger.Info("启动----OK");
						return true;
					}
      	  	       NGLogger.Error("E554: 未知错误，启动失败");
      	  	       	return false;
      	  		} //end if
	return true;
}


// Skip the splash
function skipSplash() {
	if (imgVP("480_800\\FIRST_START")) {
      	NGLogger.Warning("尝试跳过介绍...");
      	for (var i = 0; i < 5; i++) { //向左滑动5次屏幕以关闭介绍
      	  	device0.GUICOMMON_Move(LEFT[0], LEFT[1], LEFT[2], LEFT[3]); //左滑一次
      	  	Sleep(TINY);
      	}
      	device0.GUICOMMON_TouchScreen(MSTY[0], MSTY[1]); //点击马上体验, 38
      	Sleep(TINY);
	}
}



/* 2013-05-08 change network */

function checkAndChangeNW(nwID) {
	if (networkCheck() != nwID) {
	}
}


function startPT(nwID){
	NWNAME = ['NULL', 'CMCC', 'TD', 'EDGE'][nwID];
	NGLogger.UserLog("开始", "==MM性能测试== .......网络："+ NWNAME, 'Green');
	csvOut(PTfirstStart, '首次启动');
	csvOut(PTnormalStart, '有缓存启动');
	csvOut(PTfirstTab, '无缓存标签页加载');
	csvOut(PTappsDetails, '无缓存详情页加载');		// x3
	csvOut(PTsearchApp, '无缓存应用搜索(软件)');		// x3
	csvOut(PTsearchAndDetails, '无缓存应用搜索和应用详情');
	csvOut(PTdownload, '应用下载');
	NGLogger.UserLog("结束", "==MobileMarket性能测试==", 'Green'); 
}


//[CSV] e.g: EDGE, 首次启动, 12000, 2013-05-09 09:00
function _csvOut(casefunc, caseName) {
	NGLogger.UserLog('PT', caseName, 'BlueViolet');
	var d = new Date();
	var logTime = d.getFullYear() +'-'+ (d.getMonth()+1) +'-'+ d.getDate() +' '+ d.getHours() +':'+ d.getMinutes();
	var strOut = NWNAME + ',' + caseName + ',' + casefunc() + ',' + logTime;
	NGShell.Execute('cmd.exe', '/c echo ' + strOut + '>>c:\\pt.csv', true);
}


//[CSV] e.g: EDGE, 首次启动, 12000, 2013-05-13 09:00
function csvOut(casefunc, caseName) {
	NGLogger.UserLog('PT', caseName, 'BlueViolet');
	var d = new Date();
	var logTime = d.getFullYear() +'-'+ (d.getMonth()+1) +'-'+ d.getDate() +' '+ d.getHours() +':'+ d.getMinutes();
	var out2csv = function(strTime) {
		var strOut = NWNAME + ',' + caseName + ',' + strTime + ',' + logTime;
    	NGShell.Execute('cmd.exe', '/c echo ' + strOut + '>>c:\\pt.csv', true);
	}
	
	var ptTime = casefunc();
	if (ptTime === true) ptTime = 0;
	if (caseName === '无缓存应用搜索和应用详情') {
		for (var i=0; i < 6; i++) {
			caseName = (i % 2) ? '无缓存详情页加载' : '无缓存应用搜索(软件)';
			NGLogger.Info(caseName + 'Time: ' + ptTime[i]);
			out2csv(ptTime[i]);
		}
	} else {
		out2csv(ptTime);
	}
}
