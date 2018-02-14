/**
 * Global variables
 */
"use strict";

var userAgent = navigator.userAgent.toLowerCase(),
  initialDate = new Date(),

  $document = $(document),
  $window = $(window),
  $html = $("html"),

  isDesktop = $html.hasClass("desktop"),
  isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTouch = "ontouchstart" in window;

$(function () {
  /*подключение menu*/
  var menuSp = $('.rd-navbar');
  menuSp.rdnavbar({
    stuckWidth: 768,
    stuckMorph: true,
    stuckLayout: "rd-navbar-static",
    responsive: {
      0: ["rd-navbar-fixed"],
      768: ["rd-navbar-fullwidth"],
      992: ["rd-navbar-static"],
      1200: menuSp.attr("data-rd-navbar-lg").split(" ")
    },
    onepage: {
      enable: false,
      offset: 0,
      speed: 400
    }
  });

  /*to-top*/
  /**
   * UI To Top
   * @description Enables ToTop Button
   */
  if (isDesktop) {
    $().UItoTop({
      easingType: 'easeOutQuart',
      containerClass: 'ui-to-top fa fa-angle-up'
    });
  }

  /**
   * year copyright
   */
  var now = new Date();
  var getYear = now.getFullYear();
  var elCopyrightYear = document.getElementById('copyright-year');
  if (elCopyrightYear) {
    elCopyrightYear.innerHTML = getYear;
  }


    $('#camera').camera({
      autoAdvance: false,
      height: '' + 590 / 2050 * 100 + '%',
      minHeight: '590px',
      pagination: false,
      thumbnails: false,
      playPause: false,
      hover: false,
      loader: 'none',
      navigation: true,
      navigationHover: false,
      mobileNavHover: false,
      fx: 'simpleFade'
    });

});

