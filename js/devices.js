          function changePassword() {
            // 显示更改密码的弹出框
            var modal = document.getElementById("changePasswordModal");
            modal.style.display = "block";
          }

          function confirmChangePassword() {
            var oldPassword = document.getElementById("oldPasswordInput").value;
            var newPassword = document.getElementById("newPasswordInput").value;

            if (oldPassword && newPassword) {
              var requestData = {
                oldPassword: CryptoJS.MD5(oldPassword).toString(),
                newPassword: newPassword,
              };

              $.ajax({
                url: "https://mock.presstime.cn/mock/64aca3beace0545a9f41cee1/example/upload_change-password",
                type: "POST",
                data: requestData,
                success: function(response) {
                  if (response.data.msg === "修改成功！") {
                    // 密码修改成功
                    alert("密码修改成功");
                    // 清空输入框
                    document.getElementById("oldPasswordInput").value = "";
                    document.getElementById("newPasswordInput").value = "";
                    document.getElementById("confirmPasswordInput").value = "";
                    // 关闭弹出框
                    var modal = document.getElementById("changePasswordModal");
                    modal.style.display = "none";
                    // 跳转到登录页面重新登录
                    window.location.href = "index.html";
                  } else if (response.data.msg === "原密码错误") {
                    // 原密码错误
                    alert("原密码错误，请重新输入");
                    // 清空输入框
                    document.getElementById("oldPasswordInput").value = "";
                    document.getElementById("newPasswordInput").value = "";
                    document.getElementById("confirmPasswordInput").value = "";
                  } else {
                    // 其他错误
                    alert("密码修改失败，请重试");
                  }
                },
                error: function(xhr, status, error) {
                  console.error("密码更改失败:", error);
                }
              });
            }
          }

          function cancelChangePassword() {
            // 关闭弹出框
            var modal = document.getElementById("changePasswordModal");
            modal.style.display = "none";
          }

          function logout() {
            // 执行注销的操作
            console.log("执行注销操作");
            // 可以在这里编写相关代码来处理注销的逻辑

            // 弹出确认对话框
            var confirmed = confirm("确认注销吗？");
            if (confirmed) {
              // 用户确认注销，跳转到登录页面
              window.location.href = "index.html";
            } else {
              // 用户取消注销，不执行任何操作
            }
          }

          function handleDropdownChange(select) {
            const selectedValue = select.value;
            if (selectedValue) {
              // 重置选择为用户管理
              select.value = '';
              // 跳转到选中的链接或执行对应的函数
              window.location.href = selectedValue;
            }
          }
    
    //模拟插入表格
    $(document).ready(function() {
      // 使用AJAX方式获取设备管理数据
      $.ajax({
        url: "https://mock.presstime.cn/mock/64aca3beace0545a9f41cee1/example/test_1",
        type: "GET",
        // data:{name:'王二麻子',pwd:94666}   data:传参参数，必须是对象形式，
        // dataType:期望的数据类型，如果为json，会将后端返回的json串，自动解析；如果不为json，后端传什么，就接收什么数据，
        //headers:
        dataType: "json",
        success: function(data) {
          // 在成功回调函数中处理获取到的数据
          insertDataIntoTable(data.list);
        },
        error: function(xhr, status, error) {
          console.error("请求错误:", error);
        }
      });
      // 将数据插入到表格中
      function insertDataIntoTable(data) {
        var tbody = $("#devices-tbody"); // 获取表格的tbody元素
        tbody.empty(); // 清空表格内容

        // 遍历数据并插入到表格中
        data.forEach(function(item) {
          var row = $("<tr>"); // 创建新的行
          // 创建单元格并设置其内容为数据对象的字段值
          var versionCell = $("<td>").text(item.version);
          row.append(versionCell);

          //var statusCell = $("<td>").text(item.status ? "正常" : "异常");
          var serialCell = $("<td>").text(item.serial);
          row.append(serialCell);  
          var TempHighPointCell = $("<td>").text(item.TempHigh.toFixed(2) + "°C");
          row.append(TempHighPointCell);

          var TempLowCell = $("<td>").text(item.TempLow.toFixed(2) + "°C");
          row.append(TempLowCell);

          var RHHighCell = $("<td>").text(item.RHHigh.toFixed(2) + "N");
          row.append(RHHighCell);

          var RHLowCell = $("<td>").text(item.RHLow.toFixed(2) + "N");
          row.append(RHLowCell);

          var IntervalCell = $("<td>").text(item.Interval.toFixed(2) + "S");
          row.append(IntervalCell);

          var BatteryCell = $("<td>").text(item.Battery);
          row.append(BatteryCell);

          var WIFIIntervalCell = $("<td>").text(item.WIFIInterval);
          row.append(WIFIIntervalCell);
          //row.append(idCell, statusCell, measurementPointCell, measurementGroupCell, lastValueCell, lastMeasurementCell);
          tbody.append(row); // 将新的行添加到表格中
        });
      }    
    });



    function changeTab(tabName) {
      // 隐藏所有内容
      var contents = document.getElementsByClassName("content");
      for (var i = 0; i < contents.length; i++) {
        contents[i].style.display = "none";
      }
        
      
      // 显示选中的内容
      document.getElementById(tabName + "-content").style.display = "block";
      
      // 切换选项卡的样式
      var tabs = document.getElementsByClassName("table-li");
      for (var i = 0; i < tabs.length; i++) {
        tabs[i].classList.remove("active");
      }
      if(document.getElementById(tabName)){
        document.getElementById(tabName).classList.add("active");
      }

      if (tabName === "monitoring") {
        // 刷新数据监控页面的内容
        refreshMonitoringContent();
      }else if (tabName ==="alarms") {
        refreshAlarmsContent();  
      }

    }
    
    function refreshAlarmsContent() {
      $.ajax({
        url: "https://mock.presstime.cn/mock/64aca3beace0545a9f41cee1/example/test_3",
        type: "GET",
        // data:{name:'王二麻子',pwd:94666}   data:传参参数，必须是对象形式，
        // dataType:期望的数据类型，如果为json，会将后端返回的json串，自动解析；如果不为json，后端传什么，就接收什么数据，
        //headers:
        dataType: "json",
        success: function(data) {
          // 在成功回调函数中处理获取到的数据
          insertDataIntoTable2(data.list);
        },
        error: function(xhr, status, error) {
          console.error("请求错误:", error);
        }
      });

      // 将数据插入到表格中
       function insertDataIntoTable2(data) {
        var unreadTbody = $("#unread-alarms-tbody"); // 获取未读预警表格的 tbody 元素
        var readTbody = $("#read-alarms-tbody"); // 获取已读预警表格的 tbody 元素
        // 获取起始时间和截止时间的输入框元素
        var startTimeInput = document.getElementById("start-time");
        var endTimeInput = document.getElementById("end-time");

        var startTime = new Date(startTimeInput.value);
        var endTime = new Date(endTimeInput.value);
        //console.log(startTime);
        //console.log(endTime);    

        // 监听日期选择事件
        startTimeInput.addEventListener("change", handleDateChange);
        endTimeInput.addEventListener("change", handleDateChange);    
         // 处理日期选择事件的回调函数
        function handleDateChange() {
         // 检查起始时间和截止时间是否都已选取
          if (startTimeInput.value && endTimeInput.value) {
            // 获取选取的起始时间和截止时间
            var startTime = new Date(startTimeInput.value);
            var endTime = new Date(endTimeInput.value);
            console.log(startTime);
            console.log(endTime);                
            refreshAlarmsContent();
          }     
        }

        unreadTbody.empty(); // 清空未读预警表格内容
        readTbody.empty(); // 清空已读预警表格内容

        // 遍历数据并插入到表格中
        data.forEach(function(item) {
          var row = $("<tr>"); // 创建新的行
          // 创建单元格并设置其内容为数据对象的字段值
          if(item.type!="N"){
          var serialCell = $("<td>").text(item.serial);
          row.append(serialCell); 

          var statusCell = $("<td>").text(item.status ? "已读" : "未读"); 
          row.append(statusCell); 


          var typeCell = $("<td>").text(item.type);
          // if(typeCell == "TH"){
          //   row.append("温度");
          // }
          row.append(typeCell);

          if(item.type=="TH"){
            var errorCell = $("<td>").append("温度上限报警");
            row.append(errorCell);
          }else if(item.type=="TL"){
            var errorCell = $("<td>").append("温度下限报警");
            row.append(errorCell);            
          }else if(item.type=="RH"){
            var errorCell = $("<td>").append("压力上限报警");
            row.append(errorCell);            
          }else if(item.type=="RL"){
            var errorCell = $("<td>").append("压力下限报警");
            row.append(errorCell);            
          }else if(item.type=="TH/RH"){
            var errorCell = $("<td>").append("温度上限/压力上限");
            row.append(errorCell);            
          }else if(item.type=="TH/RL"){
            var errorCell = $("<td>").append("温度上限/压力下限");
            row.append(errorCell);            
          }else if(item.type=="TL/RH"){
            var errorCell = $("<td>").append("温度下限/压力上限");
            row.append(errorCell);            
          }else if(item.type=="TL/RL"){
            var errorCell = $("<td>").append("温度下限/压力下限");
            row.append(errorCell);            
          }

          var dateCell = $("<td>").text(item.date);
          row.append(dateCell);
          var itemDate = new Date(item.date);
          //console.log(itemDate);

          // 检查日期是否在选定的时间范围内
          if (startTime == "Invalid Date" && endTime == "Invalid Date") {
            if (item.status) {
              readTbody.append(row); // 插入到已读预警表格中
            } else {
              unreadTbody.append(row); // 插入到未读预警表格中
            }
          }else{
              if (itemDate >= startTime && itemDate <= endTime) {
                if (item.status) {
                  readTbody.append(row); // 插入到已读预警表格中
                } else {
                  unreadTbody.append(row); // 插入到未读预警表格中
                }
              }          
          }
          }
        });
      }
    }


    function showUnreadAlarms() {
      $("#unread-alarms-tbody").show(); // 显示未读预警表格
      $("#read-alarms-tbody").hide(); // 隐藏已读预警表格
    }

    function showReadAlarms() {
      $("#unread-alarms-tbody").hide(); // 隐藏未读预警表格
      $("#read-alarms-tbody").show(); // 显示已读预警表格
    }

    function markAllAsRead() {
      var unreadTbody = $("#unread-alarms-tbody");
      var readTbody = $("#read-alarms-tbody");

        unreadTbody.find("tr").each(function () {
          var row = $(this);
          row.find("td:nth-child(2)").text("已读"); // 将状态更改为已读
          row.appendTo(readTbody); // 将行添加到已读预警表格中
        });
      unreadTbody.empty(); // 清空未读预警表格内容
      alert("已全部标记为已读"); //弹出对话框
    }



  function refreshMonitoringContent() {
      $.ajax({
      url: 'https://mock.presstime.cn/mock/64aca3beace0545a9f41cee1/example/test_2',
      type: 'GET',
      success: function(data) {
        var myChart1= echarts.getInstanceByDom(document.getElementById('main'));
        if (myChart1== null) { // 如果不存在，就进行初始化。
          myChart1= echarts.init(document.getElementById('main'));
        }        
        // 指定图表的配置项和数据
        var option = {
          //设置标题
          title: {
            text: '温度  湿度',
            subtext: 'Real-Time Data'
          },
          //图标提示框组件
          tooltip: {
            trigger: 'axis'
          },
          //图例组件 可选button
          legend: {
            data: ['温度', '湿度']
          },
          //工具箱组件
          toolbox: {
            show: true,
            feature: {
              //数据视图工具，可以展现当前图表所用的数据，编辑后可以动态更新
              dataView: { show: true, readOnly: true },
              //动态类型切换 折线 柱状 堆叠
              magicType: { show: true, type: ['line', 'bar','stack'] },
              //配置项还原
              restore: { show: true },
              saveAsImage: { show: true }
            }
          },
          //是否启用拖拽重计算特性，默认关闭(即值为false)  
          calculable: true,
          xAxis: [
            {
              //坐标轴类型，横轴默认为类目型'category'
              type: 'category',
              //类目型坐标轴文本标签数组，指定label内容。 数组项通常为文本，'\n'指定换行 
              data: [],
              //data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
              axisLabel: { //设置x轴的字
                show:true,
                interval:0,//使x轴横坐标全部显示
              },
            }
          ],
          yAxis: [
            {
              type: 'value'
            }
          ],
          //sereis的数据: 用于设置图表数据之用。series是一个对象嵌套的结构；对象内包含对象 
          series: [
            {
              //系列名称，如果启用legend，该值将被legend.data索引相关  
              name: '温度',
              //图表类型，必要参数！如为空或不支持类型，则该系列数据不被显示。
              type: 'bar',
              data: [] ,// 初始为空数组
              // data: [
              //   2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3
              // ],
              //系列中的数据标注内容  
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              // //系列中的数据标线内容
              markLine: {
                data: [{ type: 'average', name: 'Avg' }]
              }
            },
            {
              //系列名称，如果启用legend，该值将被legend.data索引相关  
              name: '湿度',
              type: 'bar',
              data: [] ,// 初始为空数组
              // data: [
              //   2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3
              // ],
              markPoint: {
                data: [
                  { type: 'max', name: 'Max' },
                  { type: 'min', name: 'Min' }
                ]
              },
              markLine: {
                data: [{ type: 'average', name: 'Avg' }]
              }
            }
          ]
          };
          // 使用刚指定的配置项和数据显示图表。
          // myChart.setOption(option);
        // 处理成功返回的JSON数据
        var xAxisData = [];
        var series1Data = [];
        var series2Data = [];
        

        var myChart2= echarts.getInstanceByDom(document.getElementById('main1'));
        if (myChart2== null) { // 如果不存在，就进行初始化。
          myChart2= echarts.init(document.getElementById('chartContainer'));
        }          
        var option2 = {        
          title: {
            text: '实时预警',
            subtext: 'Real-Time WARNING'
          },          
          tooltip: {
            formatter: '{a} <br/>{b} : {c}%'
          },
          grid: [
            {
              top: '20%',
              width: '50%',
              height: '60%',
              containLabel: true
            },
            {
              top: '20%',
              left: '55%',
              width: '40%',
              height: '60%',
              containLabel: true
            }
          ],          
          series: [
            {
              name: 'Pressure',
              type: 'gauge',
              radius: '60%',
              min: 30, // 最小值
              max: 60, // 最大值
              splitNumber: 10, // 仪表盘刻度的分割段数
              itemStyle: {
                // 仪表盘指针颜色配置
                color: '#f37215', // 颜色
                shadowColor: 'rgba(0,138,255,0.45)', // 阴影颜色
                shadowBlur: 10, // 图形阴影的模糊大小
                shadowOffsetX: 2, // 阴影水平方向上的偏移距离
                shadowOffsetY: 2 // 阴影垂直方向上的偏移距离
              },                
              xAxisIndex: 0,
              yAxisIndex: 0,
              progress: {
                show: true, // 是否显示进度条
                roundCap: true, // 是否在两端显示成圆形
                width: 18, // 进度条宽度
                itemStyle: {
                  // 进度条颜色配置
                  color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#f12711' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#f5af19' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },
              axisLine: {
                show: true, // 是否显示仪表盘轴线
                roundCap: true, // 是否在两端显示成圆形
                lineStyle: {
                  width: 18 // 轴线宽度
                }
              },
              axisTick: {
                show: true, // 是否显示刻度
                distance: -29,
                itemStyle: {
                  color: '#fff',
                  width: 2
                }
              },
              splitLine: {
                show: true, // 是否显示分隔线
                distance: -30
              },
              axisLabel: {
                show: true, // 是否显示标签
                distance: -10
              },

              pointer: {
                show: true, // 是否显示指针
                itemStyle: {
                  // 指针颜色配置
                  color: {
                    type: 'linear',
                    x: 1,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [
                      {
                        offset: 0,
                        color: '#f12711' // 0% 处的颜色
                      },
                      {
                        offset: 1,
                        color: '#f5af19' // 100% 处的颜色
                      }
                    ],
                    global: false // 缺省为 false
                  }
                }
              },              
              detail: {
                show: true, // 是否显示详情
                valueAnimation: true, // 是否开启标签的数字动画
                borderRadius: 8, // 文字块的圆角
                offsetCenter: [0, '50%'], // 相对于仪表盘中心的偏移位置
                fontSize: 50, // 文字的字体大小
                fontWeight: 'bolder', // 文字字体的粗细

                formatter: function (value) {
                  // 格式化函数，根据不同的指针值返回相应的名称
                  if (value < 40) {
                    return '{nameLow|Low}';
                  } else if (value < 50) {
                    return '{nameMedium|Medium}';
                  } else {
                    return '{nameHigh|High}';
                  }
                },
                rich: {
                  // 富文本样式配置
                  nameLow: {
                    color: '#FFA500', // 'Low' 的颜色
                    fontSize: 30,
                    fontWeight: 'bold',
                  },
                  nameMedium: {
                    color: '#B22222', // 'Medium' 的颜色
                    fontSize: 30,
                    fontWeight: 'bold',
                  },
                  nameHigh: {
                    color: '#ff0000', // 'High' 的颜色
                    fontSize: 30,
                    fontWeight: 'bold',
                    //align: 'center', // 设置为居中对齐
                  }
                },
              },
              data: [
                {
                  value: null,
                  name: 'DATA',
                }
              ]
            },
            {
              name: 'Humidity',
              type: 'gauge',
              radius: '60%',
              xAxisIndex: 1,
              yAxisIndex: 1,
              axisLine: {
                lineStyle: {
                  width: 10,
                  color: [
                    [0.3, '#67e0e3'],
                    [0.7, '#37a2da'],
                    [1, '#fd666d']
                  ]
                }
              },
              pointer: {
                itemStyle: {
                  color: 'auto'
                }
              },
              axisTick: {
                distance: -10,
                length: 8,
                lineStyle: {
                  color: '#fff',
                  width: 2
                }
              },
              splitLine: {
                distance: -30,
                length: 30,
                lineStyle: {
                  color: '#fff',
                  width: 5
                }
              },
              axisLabel: {
                color: 'inherit',
                distance: 40,
                fontSize: 20
              },
              detail: {
                valueAnimation: true,
                offsetCenter: [0, '50%'], // 相对于仪表盘中心的偏移位置
                formatter: '{value} °C',
                color: 'inherit'
              },
              data: [
                {
                  value: null,
                  name: 'DATA'
                }
              ]
            }            
          ],
          media: [
            {
              option: {
                series: [
                  { center: ['26%', '50%'] },
                  { center: ['77%', '50%'] },
                ]
              }
            },
          ],
        };




        var myChart3= echarts.getInstanceByDom(document.getElementById('main2'));
        if (myChart3== null) { // 如果不存在，就进行初始化。
          myChart3= echarts.init(document.getElementById('main2'));
        }          
        var intervalData = [];
        var wifiIntervalData = [];

        var option3 = {
          title: [{
            text: '采集间隔 / WIFI采集间隔',
            subtext: 'Interval',
            left: 'left'
          },],
          tooltip: {
            trigger: 'item'
          },
          legend: {
            orient: 'vertical',
            bottom: 'bottom'
          },
          series: [
            {
              name: 'Access From',
              type: 'pie',
              radius: '50%',
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },         

            },
            {
              name: 'Access From2',
              type: 'pie',
              radius: '50%',
              data: [],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              },            
            }
          ],

          media: [
            {
              option: {
                series: [
                  { center: ['25%', '50%'] },
                  { center: ['75%', '50%'] },
                ]
              }
            },
          ],

        };   
        //轮播1个饼状图
        // var app = {};
        // app.currentIndex = -1;
        // setInterval(function () {
        //   var dataLen = option.series[0].data.length;
        //   // 取消之前高亮的图形
        //   myChart3.dispatchAction({
        //     type: 'downplay',
        //     seriesIndex: 0,
        //     dataIndex: app.currentIndex
        //   });
        //   app.currentIndex = (app.currentIndex + 1) % dataLen;
        //   // 高亮当前图形
        //   myChart3.dispatchAction({
        //     type: 'highlight',
        //     seriesIndex: 0,
        //     dataIndex: app.currentIndex
        //   });
        //   // 显示 tooltip
        //   myChart3.dispatchAction({
        //     type: 'showTip',
        //     seriesIndex: 0,
        //     dataIndex: app.currentIndex
        //   });  
        // }, 5000);        


        var myChart4= echarts.getInstanceByDom(document.getElementById('main3'));
        if (myChart4== null) { // 如果不存在，就进行初始化。
          myChart4= echarts.init(document.getElementById('main3'));
        }          
        var gaugeData = [];
        var option4;

        //动态显示设备下拉列表
        var currentSelection = $('#dataSelector').val(); // 保存当前选中的值
        var optionsHtml = '';

        for (var i = 0; i < data.list.length; i++) {

          var serialValue = data.list[i].serial;
          var selectedAttr = serialValue === currentSelection ? 'selected' : ''; // 检查是否为当前选中值

          optionsHtml += '<option value="' + serialValue + '" ' + selectedAttr + '>' + serialValue + '</option>';
        }
 

        // 将动态生成的<option>元素添加到下拉列表中
        $('#dataSelector').html(optionsHtml);




 

        // 遍历返回的数据列表，提取降雨量和蒸发量的数值
        data.list.forEach(function(item) {
          xAxisData.push(item.serial);
          series1Data.push(item.rainfall);
          series2Data.push(item.evaporation);   
          option2.series[0].data[0].value = item.battery; 
          option2.series[1].data[0].value = item.battery; 
          //采集次数
          var intervalObject ={
            value: item.interval,
            name: item.serial,
          } 
          var wifiIntervalObject ={
            value: item.wifi_interval,
            name: item.serial,
          } 
          var dataObject = {
              value: item.battery,
              name: item.serial,
          };
          gaugeData.push(dataObject);   
          intervalData.push(intervalObject);
          wifiIntervalData.push(wifiIntervalObject);
        }); 

        //console.log(wifiIntervalData);
        //console.log(gaugeData);
        const numRows = Math.ceil(gaugeData.length / 3); // 计算总行数
        const itemsPerRow = 3; // 每行最多的数据项数量
        // const titleOffsetX = ['-30%', '0%', '30%']; // 每行的水平偏移量
        // const titleOffsetY = ['-20%', '0%', '20%']; // 每行的垂直偏移量
        // const detailOffsetX = ['-30%', '0%', '30%']; // 每行的水平偏移量
        // const detailOffsetY = ['-10%', '10%', '30%']; // 每行的垂直偏移量    

        const titleOffsetX = ['-40%', '0%', '40%']; // 每行的水平偏移量
        const titleOffsetY = ['-30%', '0%', '30%']; // 每行的垂直偏移量
        const detailOffsetX = ['-40%', '0%', '40%']; // 每行的水平偏移量
        const detailOffsetY = ['-20%', '10%', '40%']; // 每行的垂直偏移量       
        // 生成 gaugeData 数组
        generateGaugeData(gaugeData);
        // 根据接收到的数据生成 gaugeData 数组
        function generateGaugeData(data) {
          gaugeData = [];
          data.forEach(function(item4,index4) {
          const rowIndex = Math.floor(index4 / itemsPerRow); // 计算所在的行数
          const colIndex = index4 % itemsPerRow; // 计算所在的列数
            var dataObject1 = {
              value: item4.value,
              name: item4.name,
              title: {
                offsetCenter: [titleOffsetX[colIndex], titleOffsetY[rowIndex]],
                fontSize: 15
              },
              detail: {
                valueAnimation: true,
                offsetCenter: [detailOffsetX[colIndex], detailOffsetY[rowIndex]],
                fontSize: 10
              }
            };
            gaugeData.push(dataObject1);
          });
        }
        option4 = {
          title: {
            text: '电池电量',
            subtext: 'Battery Level',
            fontSize: 50,
          },
          series: [
            {
              type: 'gauge',
              startAngle: 90,
              endAngle: -270,
              pointer: {
                show: false
              },
              progress: {
                show: true,
                overlap: false,
                roundCap: true,
                clip: false,
                itemStyle: {
                  borderWidth: 1,
                  borderColor: '#464646'
                }
              },
              axisLine: {
                lineStyle: {
                  width: 60//线条宽度
                }
              },
              splitLine: {
                show: false,
                distance: 0,
                length: 10
              },
              axisTick: {
                show: false
              },
              axisLabel: {
                show: false,
                distance: 50
              },
              data: gaugeData,
              detail: {
                width: 50,
                height: 14,
                fontSize: 14,
                color: 'inherit',
                borderColor: 'inherit',
                borderRadius: 20,
                borderWidth: 1,
                formatter: '{value}%'
              }
            }
          ]
        };

        //console.log(option.xAxis.data);
        // 更新图表的数据
        option.xAxis[0].data = xAxisData; // 更新降雨量数据
        option.series[0].data = series1Data; // 更新降雨量数据
        option.series[1].data = series2Data; // 更新蒸发量数据

        option3.series[0].data =  intervalData;
        option3.series[1].data =  wifiIntervalData;

        option4.data = gaugeData; // 更新 gaugeData

        myChart4.setOption(option4);
        //console.log(option4.data);
        // console.log(option.series[0].data);
        // console.log(option.series[1].data);
        // 使用新的配置项和数据显示图表
        myChart1.setOption(option);
        myChart2.setOption(option2);
        myChart3.setOption(option3);
      },

      error: function(error) {
        // 处理请求失败的情况
      console.log('Error:', error);
      }
      });
    }



    // 定时刷新数据的时间间隔（单位：毫秒）
    var refreshInterval = 5000; // 5秒钟

    // 定时刷新数据
    var refreshTimer = setInterval(refreshMonitoringContent, refreshInterval);

