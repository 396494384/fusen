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
  //左侧列表选中当前
  var _key = window.location.href.split('admin')[1];
  var _asideItem = $('.aside .layui-nav li');
  if (_key === '/' || _key === '') {
    _key = '/index'
  }
  // console.log(_key)
  _asideItem.each(function () {
    var _currKey = $(this).attr('data-key');
    var _idx = $(this).index();
    if (_key.indexOf(_currKey) != -1) {
      _asideItem.removeClass('layui-this').removeClass('layui-nav-itemed').eq(_idx).addClass('layui-this');
      if ($(this).find('dd').size() > 0) {
        $(this).addClass('layui-nav-itemed');
      }
      return;
    }
  })

  layui.use(['layer'], function () {
    var layer = layui.layer;
    //清除缓存
    $(".clear_cache").click(function () {
      window.sessionStorage.clear();
      window.localStorage.clear();
      var clearing = layer.msg('清除缓存中，请稍候', {
        icon: 16,
        time: false,
        shade: [0.8, '#ffffff']
      });
      setTimeout(function () {
        layer.close(clearing);
        layer.msg("缓存清除成功！", {
          icon: 1,
          time: 1000,
          shade: [0.8, '#ffffff']
        });
      }, 1000);
    })

    //修改密码
    $('.modify').click(function () {
      layer.open({
        type: 1,
        title: '修改密码',
        closeBtn: 2,
        btn: ['确认修改'],
        content: '<div class="layui-form"><div class="layui-form-item" style="margin-top: 15px;"><label class="layui-form-label">当前密码</label><div class="layui-input-inline"><input type="password" class="layui-input old_pwd"></div></div><div class="layui-form-item"><label class="layui-form-label">新密码</label><div class="layui-input-inline"><input type="password" class="layui-input pwd"></div></div><div class="layui-form-item"><label class="layui-form-label">确认新密码</label><div class="layui-input-inline"><input type="password" class="layui-input re_pwd"></div></div></div>',
        yes: function () {
          var old_pwd = $(".old_pwd").val();
          var pwd = $(".pwd").val();
          var re_pwd = $(".re_pwd").val();
          if (old_pwd == "") {
            layer.msg("请输入当前密码", {
              time: 1000
            })
          } else if (pwd == "") {
            layer.msg("请输入新密码", {
              time: 1000
            })
          } else if (re_pwd == "") {
            layer.msg("请输入确认新密码", {
              time: 1000
            })
          } else if (pwd != re_pwd) {
            layer.msg("两次密码输入不一致", {
              time: 1000
            })
          } else {
            $.ajax({
              type: "POST",
              url: '/api/modify',
              data: {
                oldpwd: old_pwd,
                newpwd: re_pwd
              },
              beforeSend: function () {
                layer.load(2, {
                  shade: [0.2, '#000']
                });
              },
              success: function (data) {
                layer.closeAll();
                layer.msg(data.msg, {
                  time: 1000
                });
                if (data.code == 200) {
                  setTimeout(function () {
                    window.location.href = "/admin/login";
                  }, 1000)
                }
              },
              error: function () {
                layer.closeAll();
                layer.msg("与服务器通信发生错误", {
                  time: 1000
                });
              }
            });
          }
        }
      })
    })

    // 退出
    $('.logout').click(function () {
      $.ajax({
        url: '/api/logout',
        beforeSend: function () {
          layer.load(2, {
            shade: [0.2, '#000']
          });
        },
        success: function (data) {
          layer.closeAll();
          layer.msg(data.msg, {
            time: 1000
          });
          if (data.code == 200) {
            setTimeout(function () {
              window.location.href = "/admin/login";
            }, 1000)
          }
        },
        error: function () {
          layer.closeAll();
          layer.msg("与服务器通信发生错误", {
            time: 1000
          });
        }
      });
    })
  })
})