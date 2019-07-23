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
      indexModule2.find('.imgs img').hide().eq(_index).show();
      indexModule2.find('.texts div').hide().eq(_index).show();
    })
  } catch (e) { }



  // news
  try {
    $('.news_list li a').click(function () {
      $('body').css('overflow', "hidden");
      $('.news_details').fadeIn();
    })
    $('.news_big a').click(function () {
      $('body').css('overflow', "hidden");
      $('.news_details').fadeIn();
    })
    $('.news_details span.close').click(function () {
      $('.news_details').fadeOut();
      setTimeout(function () {
        $('body').css('overflow', "auto");
      }, 500)
    })
    $('.news_details .page .back').click(function () {
      $('.news_details').fadeOut();
      setTimeout(function () {
        $('body').css('overflow', "auto");
      }, 500)
    })
  } catch (e) { }

  // product
  try {




    setTimeout(function () {
      $('.product_imgs > div').each(function () {
        $(this).find('.text').height($(this).outerHeight(true))
      })
    }, 200);
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
    var aboutModule1 = $('.about .about_module1');
    var aboutModule1Top = aboutModule1.offset().top;
    var aboutModule2 = $('.about .about_module2');
    var aboutModule2Top = aboutModule2.offset().top;
    var aboutModule3 = $('.about .about_module3');
    var aboutModule3Top = aboutModule3.offset().top;
    var aboutModule4 = $('.about .about_module4');
    var aboutModule4Top = aboutModule4.offset().top;
    var scrollTop = $(window).scrollTop();
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

})