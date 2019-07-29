$(function () {
  // back top
  $(".back_top").click(function () {
    $("body, html").animate({
      "scrollTop": 0
    }, 500)
  })

  // search
  $('.search_btn').click(function () {
    $('.search').slideToggle()
    if ($(this).hasClass('active')) {
      $(this).removeClass('active')
    } else {
      $(this).addClass('active')
    }
  })
  $(".search .confirm").click(function () {
    var _searchKey = $(".search_key").val();
    if (_searchKey == "") {
      layer.msg("请输入搜索关键字", {
        time: 1000
      })
    } else {
      window.location.href = "result?search=" + _searchKey;
    }
  })

  // nav
  $('.nav>li').hover(function () {
    $('.nav_item').hide();
    $(this).addClass('hover').find('.nav_item').slideDown();
  }, function () {
    $('.nav>li').removeClass('hover');
    $('.nav_item').slideUp();
  })

  // index script
  try {
    $('.banner .slider').bxSlider({
      mode: 'fade',
      auto: true,
      autoHover: true,
      controls: true,
      speed: 600,
      pause: 4000
    });

    var indexModule1 = $('.index_module1');
    var indexModule1Top = indexModule1.offset().top;
    var indexModule2 = $('.index_module2');
    var indexModule2Top = indexModule2.offset().top;
    var indexModule3 = $('.index_module3');
    var indexModule3Top = indexModule3.offset().top;
    var indexModule4 = $('.index_module4');
    var indexModule4Top = indexModule4.offset().top;
    var scrollTop = $(window).scrollTop();
    $(window).scroll(function () {
      try {
        scrollTop = $(window).scrollTop();
        indexModule1Top = indexModule1.offset().top;
        indexModule2Top = indexModule2.offset().top;
        indexModule3Top = indexModule3.offset().top;
        indexModule4Top = indexModule4.offset().top;
        if (scrollTop + $(window).height() - 250 > indexModule1Top) {
          indexModule1.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > indexModule2Top) {
          indexModule2.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > indexModule3Top) {
          indexModule3.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > indexModule4Top) {
          indexModule4.addClass("show")
        }
      } catch (e) { }
    })
    if (scrollTop + $(window).height() - 250 > indexModule1Top) {
      indexModule1.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > indexModule2Top) {
      indexModule2.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > indexModule3Top) {
      indexModule3.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > indexModule4Top) {
      indexModule4.addClass("show")
    }


    indexModule2.find('.btns div.left').click(function () {
      if ($(this).hasClass('active')) {
        return;
      }
      var _index = $(this).index();
      indexModule2.find('.btns div.left').removeClass('active').eq(_index).addClass('active');
      indexModule2.find('.imgs div').hide().eq(_index).show();
      indexModule2.find('.texts div').hide().eq(_index).show();
    })
  } catch (e) { }

  // news
  try {
    function showDetail(id) {
      layer.load(2, {
        shade: [0.3, '#000']
      });
      $.ajax({
        type: "POST",
        url: "/news_detail",
        data: {
          id: id
        },
        success: function (data) {
          layer.closeAll('loading');
          if (data.code == 200) {
            var data = data.data;
            $('body').css('overflow', "hidden");
            $('.news_details').find("strong.title").html(data.data.title);
            $('.news_details').find("span.date span").html(data.data.date);
            $('.news_details').find("div.text").html(data.data.content);

            if (data.prev) {
              var _prevtitle = data.prev.title.length > 12 ? data.prev.title.substring(0, 12) + "...." : data.prev.title;
              $(".news_details .page .prev").text("< " + _prevtitle).removeClass("not").attr("id", data.prev.id);
            } else {
              $(".news_details .page .prev").text("< 没有了").addClass("not").attr("id", "");
            }
            if (data.next) {
              var _nexttitle = data.next.title.length > 12 ? data.next.title.substring(0, 12) + "...." : data.next.title;
              $(".news_details .page .next").text(_nexttitle + " >").removeClass("not").attr("id", data.next.id);
            } else {
              $(".news_details .page .next").text("没有了 >").addClass("not").attr("id", "");
            }
            toggleDetail();
            $('.news_details').fadeIn().scrollTop(0);

            var clientHeight = $('body').outerHeight();
            var contentHeight = $('.news_details .content').outerHeight();
            var clientWidth = $('.news_details').outerWidth();
            if (clientHeight > contentHeight) {
              $('.news_details .content').css({ top: "50%", marginTop: (-(contentHeight / 2)) + "px" })
              $('.news_details .news_details_btns').css({
                position: "absolute",
                right: "-60px"
              }).find(".scroll_top").hide()
            } else {
              $('.news_details .content').css({ top: "0", marginTop: "0px" })
              var right = ((clientWidth - 1000) / 2) - 50;
              $('.news_details .news_details_btns').css({
                position: "fixed",
                right: right
              }).find(".scroll_top").show()
            }
          }
        },
        error: function () {
          layer.closeAll('loading');
        }
      })
    }

    function toggleDetail() {
      $(".news_details .page .prev").unbind("click").click(function () {
        if ($(this).hasClass("not")) {
          return;
        } else {
          showDetail($(this).attr("id"));
        }
      })
      $(".news_details .page .next").unbind("click").click(function () {
        if ($(this).hasClass("not")) {
          return;
        } else {
          showDetail($(this).attr("id"));
        }
      })
    }

    function destory() {
      $('.news_details').fadeOut();
      setTimeout(function () {
        $('.news_details').find("strong.title").html("");
        $('.news_details').find("span.date span").html("");
        $('.news_details').find("div.text").html("");
        $(".news_details .page .prev").text("").removeClass("not").attr("id", "");
        $(".news_details .page .next").text("").removeClass("not").attr("id", "");
        $('body').css('overflow', "auto");
      }, 500)
    }


    $('.news_list li a').click(function () {
      showDetail($(this).attr("id"))
    })
    $('.news_big a').click(function () {
      showDetail($(this).attr("id"))
    })
    $('.news_details span.close').click(function () {
      destory();
    })
    $('.news_details .page .back').click(function () {
      destory();
    })
    $('.news_details span.scroll_top').click(function () {
      $('.news_details').scrollTop(0);
    })

    var news_big = $('.news_big');
    var news_bigTop = news_big.offset().top;
    var news_list = $('.news_list');
    var news_listTop = news_list.offset().top;
    var scrollTop = $(window).scrollTop();
    $(window).scroll(function () {
      try {
        scrollTop = $(window).scrollTop();
        news_bigTop = news_big.offset().top;
        if (scrollTop + $(window).height() - 250 > news_bigTop) {
          news_big.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > news_listTop) {
          news_list.addClass("show")
        }
      } catch (e) { }
    })
    if (scrollTop + $(window).height() - 250 > news_bigTop) {
      news_big.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > news_listTop) {
      news_list.addClass("show")
    }
  } catch (e) { }

  // product
  try {
    var cause_top = $('.cause_top');
    var cause_topTop = cause_top.offset().top;
    var cause_list = $('.cause_list');
    var cause_listTop = cause_list.offset().top;
    var cause_more = $('.cause_more');
    var cause_moreTop = cause_more.offset().top;
    var scrollTop = $(window).scrollTop();
    $(window).scroll(function () {
      try {
        scrollTop = $(window).scrollTop();
        cause_topTop = cause_top.offset().top;
        if (scrollTop + $(window).height() - 250 > cause_topTop) {
          cause_top.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > cause_listTop) {
          cause_list.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > cause_moreTop) {
          cause_more.addClass("show")
        }
      } catch (e) { }
    })
    if (scrollTop + $(window).height() - 250 > cause_topTop) {
      cause_top.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > cause_listTop) {
      cause_list.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > cause_moreTop) {
      cause_more.addClass("show")
    }
  } catch (e) { }

  // product details
  try {
    setTimeout(function () {
      $('.product_imgs > div').each(function () {
        $(this).find('.text').height($(this).outerHeight(true))
      })
    }, 200);
    $('.product_details div.right .idx span').first().addClass("active");
    $('.product_details div.right img').first().addClass("show");
    $('.product_details div.right .idx span').click(function () {
      if ($(this).hasClass('active')) {
        return;
      }
      $('.product_details div.right .idx span').removeClass('active').eq($(this).index()).addClass('active');
      $('.product_details div.right img').hide().eq($(this).index()).show()
    })
    var img1 = $('.product_imgs .img1');
    var img1Top = img1.offset().top;
    var img2 = $('.product_imgs .img2');
    var img2Top = img2.offset().top;
    var img3 = $('.product_imgs .img3');
    var img3Top = img3.offset().top;
    var img4 = $('.product_imgs .img4');
    var img4Top = img4.offset().top;
    var productDetails = $('.product_details');
    var productDetailsTop = productDetails.offset().top;
    var more = $('.product .more');
    var moreTop = more.offset().top;
    var scrollTop = $(window).scrollTop();

    if (scrollTop > 72) {
      $('.product_menu').css({ "position": 'fixed', "top": 0, "left": 0, 'z-index': 10 });
    } else {
      $('.product_menu').css({ "position": 'relative', "top": 0, "left": 0, 'z-index': 1 });
    }
    $(window).scroll(function () {
      try {
        scrollTop = $(window).scrollTop();
        if (scrollTop > 72) {
          $('.product_menu').css({ "position": 'fixed', "top": 0, "left": 0, 'z-index': 10 });
        } else {
          $('.product_menu').css({ "position": 'relative', "top": 0, "left": 0, 'z-index': 1 });
        }
        img1Top = img1.offset().top;
        img2Top = img2.offset().top;
        img3Top = img3.offset().top;
        img4Top = img4.offset().top;
        img2Top = img2.offset().top;
        productDetailsTop = productDetails.offset().top;
        moreTop = more.offset().top;
        if (scrollTop + $(window).height() - 250 > img1Top) {
          img1.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > img2Top) {
          img2.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > img3Top) {
          img3.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > img4Top) {
          img4.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > productDetailsTop) {
          productDetails.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > moreTop) {
          more.addClass("show")
        }
      } catch (e) { }
    })
    if (scrollTop + $(window).height() - 250 > img1Top) {
      img1.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > img2Top) {
      img2.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > img3Top) {
      img3.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > img4Top) {
      img4.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > productDetailsTop) {
      productDetails.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > moreTop) {
      more.addClass("show")
    }

    $('.overview').click(function () {
      $(".back_top").click();
    })
    $('.parameter').click(function () {
      $("body, html").animate({
        "scrollTop": productDetailsTop - 50
      }, 1000)

    })
  } catch (e) { }

  // about 
  try {

    $(".about_module_content .text").html($(".about_module_content input[name='content']").val());





    var aboutModule1 = $('.about .about_module1');
    var aboutModule1Top = aboutModule1.offset().top;
    var aboutModule2 = $('.about .about_module2');
    var aboutModule2Top = aboutModule2.offset().top;
    var aboutModule3 = $('.about .about_module3');
    var aboutModule3Top = aboutModule3.offset().top;
    var aboutModule4 = $('.about .about_module4');
    var aboutModule4Top = aboutModule4.offset().top;
    var scrollTop = $(window).scrollTop();



    setTimeout(function () {
      var scrollType = window.location.href.split("=")[1] || 1;

      // aboutModule1Top = aboutModule1.offset().top;
      aboutModule2Top = aboutModule2.offset().top;
      aboutModule3Top = aboutModule3.offset().top;
      aboutModule4Top = aboutModule4.offset().top;
      if (scrollType == 1) {
        $("body, html").animate({
          "scrollTop": 0
        }, 1)
      } else if (scrollType == 2) {
        // console.log(aboutModule2Top)
        $("body, html").animate({
          "scrollTop": aboutModule2Top
        }, 1)
      } else if (scrollType == 3) {
        $("body, html").animate({
          "scrollTop": aboutModule3Top
        }, 1)
      } else if (scrollType == 4) {
        $("body, html").animate({
          "scrollTop": aboutModule4Top
        }, 1)
      }
    }, 100)


    $(window).scroll(function () {
      try {
        scrollTop = $(window).scrollTop();
        aboutModule1Top = aboutModule1.offset().top;
        aboutModule2Top = aboutModule2.offset().top;
        aboutModule3Top = aboutModule3.offset().top;
        aboutModule4Top = aboutModule4.offset().top;
        if (scrollTop + $(window).height() - 250 > aboutModule1Top) {
          aboutModule1.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > aboutModule2Top) {
          aboutModule2.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > aboutModule3Top) {
          aboutModule3.addClass("show")
        }
        if (scrollTop + $(window).height() - 250 > aboutModule4Top) {
          aboutModule4.addClass("show")
        }
      } catch (e) { }
    })
    if (scrollTop + $(window).height() - 250 > aboutModule1Top) {
      aboutModule1.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > aboutModule2Top) {
      aboutModule2.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > aboutModule3Top) {
      aboutModule3.addClass("show")
    }
    if (scrollTop + $(window).height() - 250 > aboutModule4Top) {
      aboutModule4.addClass("show")
    }
  } catch (e) { }

  // recruit
  try {
    $.each($('.recruit_list li'), function (i) {
      $(this).find(".recruit_detail .text").html($(this).find('.recruit_detail input[name=content]').val())
    })
    $('.recruit_list li .detail').click(function () {
      var _thisli = $(this).parents('li');
      if (_thisli.hasClass('show')) {
        _thisli.removeClass('show').find('.recruit_detail').slideUp();
      } else {
        $('.recruit_list li').removeClass('show').find('.recruit_detail').slideUp();
        _thisli.addClass('show').find('.recruit_detail').slideDown();
      }
    })
  } catch (e) { }



  // result
  try {
    var searchKey = window.location.search.split("=")[1];
    function showDetail(id) {
      layer.load(2, {
        shade: [0.3, '#000']
      });
      $.ajax({
        type: "POST",
        url: "/result_detail",
        data: {
          id: id,
          search: searchKey
        },
        success: function (data) {
          layer.closeAll('loading');
          if (data.code == 200) {
            var data = data.data;
            $('body').css('overflow', "hidden");
            $('.result_details').find("strong.title").html(data.data.title);
            $('.result_details').find("span.date span").html(data.data.date);
            $('.result_details').find("div.text").html(data.data.content);
            if (data.prev) {
              var _prevtitle = data.prev.title.length > 12 ? data.prev.title.substring(0, 12) + "...." : data.prev.title;
              $(".result_details .page .prev").text("< " + _prevtitle).removeClass("not").attr("id", data.prev.id);
            } else {
              $(".result_details .page .prev").text("< 没有了").addClass("not").attr("id", "");
            }
            if (data.next) {
              var _nexttitle = data.next.title.length > 12 ? data.next.title.substring(0, 12) + "...." : data.next.title;
              $(".result_details .page .next").text(_nexttitle + " >").removeClass("not").attr("id", data.next.id);
            } else {
              $(".result_details .page .next").text("没有了 >").addClass("not").attr("id", "");
            }
            toggleDetail();
            $('.result_details').fadeIn().scrollTop(0);

            var clientHeight = $('body').outerHeight();
            var contentHeight = $('.result_details .content').outerHeight();
            var clientWidth = $('.result_details').outerWidth();
            if (clientHeight > contentHeight) {
              $('.result_details .content').css({ top: "50%", marginTop: (-(contentHeight / 2)) + "px" })
              $('.result_details .result_details_btns').css({
                position: "absolute",
                right: "-60px"
              }).find(".scroll_top").hide()
            } else {
              $('.result_details .content').css({ top: "0", marginTop: "0px" })
              var right = ((clientWidth - 1000) / 2) - 50;
              $('.result_details .result_details_btns').css({
                position: "fixed",
                right: right
              }).find(".scroll_top").show()
            }
          }
        },
        error: function () {
          layer.closeAll('loading');
        }
      })
    }

    function toggleDetail() {
      $(".result_details .page .prev").unbind("click").click(function () {
        if ($(this).hasClass("not")) {
          return;
        } else {
          showDetail($(this).attr("id"));
        }
      })
      $(".result_details .page .next").unbind("click").click(function () {
        if ($(this).hasClass("not")) {
          return;
        } else {
          showDetail($(this).attr("id"));
        }
      })
    }

    function destory() {
      $('.result_details').fadeOut();
      setTimeout(function () {
        $('.result_details').find("strong.title").html("");
        $('.result_details').find("span.date span").html("");
        $('.result_details').find("div.text").html("");
        $(".result_details .page .prev").text("").removeClass("not").attr("id", "");
        $(".result_details .page .next").text("").removeClass("not").attr("id", "");
        $('body').css('overflow', "auto");
      }, 500)
    }
    $('.result_list li a').click(function () {
      showDetail($(this).attr("id"))
    })
    $('.result_details span.close').click(function () {
      destory();
    })
    $('.result_details .page .back').click(function () {
      destory();
    })

    $('.result_details span.scroll_top').click(function () {
      $('.result_details').scrollTop(0);
    })
  } catch (e) { }

})