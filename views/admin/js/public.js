function getNowTime() { //时间显示
  var _now = new Date();
  var _year = _now.getFullYear();
  var _month = _now.getMonth() + 1;
  var _day = _now.getDate();
  var _hour = _now.getHours();
  var _minute = _now.getMinutes();
  var _second = _now.getSeconds();
  var _weeks = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"][_now.getDay()];
  // console.log(_weeks,_year,dateFilter(_day), _month, _day)
  document.getElementById("nowTime").innerHTML = "亲爱的管理员，您好！ 欢迎登录管理后台。当前时间为： " + _year + "年" + dateFilter(_month) +
    "月" + dateFilter(_day) + "日 " + dateFilter(_hour) + ":" + dateFilter(_minute) + ":" + dateFilter(_second) + " " + _weeks
  setTimeout("getNowTime()", 1000)
}
function dateFilter(date) { //时间补0
  return ('0' + date).substr(-2, 2);
}


$(function () {
  layui.use(['layer'], function(){
    var layer = layui.layer;
    //清除缓存
    $(".clear_cache").click(function () {
      window.sessionStorage.clear();
      window.localStorage.clear();
      var clearing = layer.msg('清除缓存中，请稍候', { icon: 16, time: false, shade: [0.8, '#ffffff'] });
      setTimeout(function () {
        layer.close(clearing);
        layer.msg("缓存清除成功！", {
          icon: 1,
          time: 1000,
          shade: [0.8, '#ffffff']
        });
      }, 1000);
    })
  })
})