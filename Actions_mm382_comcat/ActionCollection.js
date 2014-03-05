
      /****************************************************************************************
      * 创建日期: 24-Jun-2013
      * 作者: Yorn Wat
      * 描述: Performance-Test of Android MobileMarket 3.8.0
      *
      * 修改日期:
      * 修改人:
      * 描述: 　
      *
      ****************************************************************************************/
     
      //#import "functions.js";
      //#import "constants.js";
      #import "performances.js";
      #import "network.js";


      function ActionCollection() {};
      
      ActionCollection =
      {
      	
      	  /**performances_test: pt launcher 
      	   * @param: null
      	   * @return: null
      	   */
      	  performances_test: function() {
			NGLogger.Info('流量数据监控开启');
			var ApplicationTreasurePackageName="com.aspire.mm";
			DeviceStatusTypeList.add(ApplicationTreasurePackageName, DeviceResourceChart.ALL);
			NGLogger.Basic_StartLogDeviceStatus(0, DeviceStatusTypeList, 1);      	  	
			NGLogger.Info('流量数据监控结束');
			NGLogger.Basic_StopLogDeviceStatus();
      	  	startPT(0);
      	  },
      	  
      	  
      	  
      	  //性能测试－3种网络自动切换
      	  ptIn3Networks: function() {
      	  	NGLogger.Info('Start...');
      	  	NGShell.Execute('cmd.exe', '/c echo 网络,模块,用时,测试时间>>c:\\pt.csv', true);
      	  	for (var i = 0; i < 1000; i++) {
      	  		var nwID = i % 3 + 1;
      	  		switch (nwID) {
      	  			case CMCC:	toCMCC(); break;
      	  			case TD:	changeBAND(TD); break;
      	  			case EDGE:	changeBAND(EDGE);
      	  		}
      	  		startPT(nwID);
      	  	}
      	  }
      	  
      } //End of ActionCollection 
//--EOF--
      
