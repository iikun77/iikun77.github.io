  function showRegister() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";

    // 清空登录页面的用户名和密码
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

    // 刷新验证码图形
    refreshCode();
  }

  function showLogin() {
    document.getElementById("register-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";

    // 清空注册页面的内容
    document.getElementById("register-username").value = "";
    document.getElementById("register-password").value = "";
    document.getElementById("confirm-password").value = "";
    document.getElementById("verification-code").value = "";

  }




  function login() {
    // 获取用户名和密码
    var username = $("#username").val();
    var password = $("#password").val();

    // 创建请求参数对象
    var requestData = {
      username: username,
      password: CryptoJS.MD5(password).toString(),
    };
    console.log(username);
    // 发起 Ajax POST 请求
    $.ajax({
      url: "https://mock.presstime.cn/mock/64aca3beace0545a9f41cee1/example/upload_userlogin",
      type: "POST",
      data: requestData,
      success: function(response) {
        // 请求成功的处理
        console.log(response);
        // 登录成功，跳转到设备页面
        if(response.data.msg=="登陆成功了..."){
          console.log(response.data.msg);
          window.location.href = "devices.html";          
        }else{
          alert("用户名或密码错误");
        }    
      },
      error: function(xhr, status, error) {
        // 请求失败的处理
        console.error(error);
        alert("登录失败，请重试");
      }
    });
  }

  var result="";
  function YZM(selector,w,h){
      // var result="";
  // 随机生成数字
      function rn(min,max){
          return parseInt(Math.random()*(max-min)+min);
      }
  //生成随机颜色
      function rc(min,max){
          var r=rn(min,max);
          var g=rn(min,max);
          var b=rn(min,max);
          return `rgb(${r},${g},${b})`;
      }
  //填充背景颜色
      var w=w;
      var h=h;
      var canvas=document.querySelector(selector);
      canvas.width = w;
      canvas.height = h;

      var ctx=canvas.getContext("2d");
      ctx.fillStyle=rc(180,230);

      ctx.fillRect(0,0,w,h);

      var pool="ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";
      result="";
  //取出随机数字
      for(var i=0;i<4;i++){
          var c=pool[rn(0,pool.length)];
      //随机字体大小
          var fs=rn(18,40);
      //随机字母数字的旋转角度
          var deg=rn(-30,30);
          ctx.font=fs+"px Simhei";
          ctx.textBaseline='top';
      //设置字体的填充颜色
          ctx.fillStyle=rc(80,150);
          ctx.save();
      //save()保存当前的绘图状态
          ctx.translate(30*i+15,15);
          ctx.rotate(deg*Math.PI/180);
          ctx.fillText(c,-10,-10);
      //context.fillText(text,x,y,maxWidth)----text是在画布上输出的文本，x和y是坐标，maxWidth是最大文本宽度
          ctx.restore();
      //restore()恢复之前保存的绘图状态
          result+=c;
          // console.log(c);
      }

    //随机生成干扰线
        for(var i=0;i<5;i++){
            ctx.beginPath();
    //beginPath()方法开始一条路径，或者重置当前的路径
            ctx.moveTo(rn(0,w),rn(0,h));
    //context.moveTo(x,y)----x是目标位置的x坐标，y是目标位置的y坐标
            ctx.lineTo(rn(0,w),rn(0,h));
    //lineTo()方法添加一个新点，然后创建从该点到画布中最后指定点的线条。(该方法并不会创建线条)
    //context.lineTo(x,y)-----x是目标位置的x坐标，y是目标位置的y坐标
            ctx.stokeStyle=rc(180,230);
    //strokeStyle属性设置或返回用于笔触的颜色、渐变或模式。
            ctx.closePath();
    //closePath()闭合路径
            ctx.stroke();
    //stroke()方法在画布上绘制确切的路径
        }
    
    //随机生成40个小的干扰圆点
        for(var i=0;i<40;i++){
            ctx.beginPath();
            ctx.arc(rn(0,w),rn(0,h),1,0,2*Math.PI);
    //arc()方法创建弧/曲线(用于创建圆或者部分圆)
            ctx.closePath();
            ctx.fillStyle=rc(150,200);
            ctx.fill();
        }
        return result;
    }
    
    // let yzm=YZM("#canvas",120,40);
    // console.log(yzm);

    document.addEventListener("DOMContentLoaded", function() {
    var canvas = document.getElementById("canvas");
    // 添加点击事件监听器
    canvas.addEventListener("click", function() {
      refreshCode();
    });
    // 生成初始的验证码图形
    // let yzm=YZM("#canvas",120,40);
    // console.log(yzm);
    });

    function refreshCode() {
      var canvas = document.getElementById("canvas");
      // 清空画布
      var ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // 重新生成验证码图形
      
      let yzm=YZM("#canvas",120,40);
      console.log(yzm);
    }


   function register() {
    // 获取注册信息
    var username = document.getElementById("register-username").value;
    var password = document.getElementById("register-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;
    var verificationCode = document.getElementById("verification-code").value;
    var acceptTerms = document.getElementById("accept-terms").checked;

    var mycode=document.getElementById("verification-code").value.toLowerCase(); ;
    // 进行注册验证
    if (!username || !password || !confirmPassword || !verificationCode || !acceptTerms) {
      alert("请填写完整信息并接受用户条款");
    } else if (password !== confirmPassword) {
      alert("密码和确认密码不一致");
    } else if (mycode !== result.toLowerCase()) {
      alert("验证码输入错误");
    } 
    else {
      // 注册成功
      alert("注册成功");
      showLogin();
    }
  }