
/**
 * Global variables
 */
"use strict";
function include(scriptUrl) {
  document.write('<script src="' + scriptUrl + '"></script>');
}
var userAgent = navigator.userAgent.toLowerCase(),
  initialDate = new Date(),

  $document = $(document),
  $window = $(window),
  $html = $("html"),

  isDesktop = $html.hasClass("desktop"),
  isIE = userAgent.indexOf("msie") != -1 ? parseInt(userAgent.split("msie")[1]) : userAgent.indexOf("trident") != -1 ? 11 : userAgent.indexOf("edge") != -1 ? 12 : false,
  isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
  isTouch = "ontouchstart" in window;

/* Google Map
 ========================================================*/

(function ($) {
  var o = document.getElementById("google-map");
  if (o) {
    //include('//maps.google.com/maps/api/js?key=AIzaSyAbF547wmpRHA68yKJP62H7yha2Nzsilm8');
    include('dist/js/googlemap.js');

    $(document).ready(function () {
      var o = $('#google-map');
      if (o.length > 0) {
        o.googleMap({
          styles: [{"featureType":"landscape","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","stylers":[{"saturation":-100},{"lightness":51},{"visibility":"simplified"}]},{"featureType":"road.highway","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"road.arterial","stylers":[{"saturation":-100},{"lightness":30},{"visibility":"on"}]},{"featureType":"road.local","stylers":[{"saturation":-100},{"lightness":40},{"visibility":"on"}]},{"featureType":"transit","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"administrative.province","stylers":[{"visibility":"off"}]},{"featureType":"water","elementType":"labels","stylers":[{"visibility":"on"},{"lightness":-25},{"saturation":-100}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00"},{"lightness":-25},{"saturation":-97}]}]
        });
      }
    });
  }
})
(jQuery);

(function ($) {
  var o = $('#camera');
  if (o.length > 0) {
    $(document).ready(function () {
      o.camera({
        autoAdvance: false,
        mobileAutoAdvance: false,
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
      })
    });
  }
})(jQuery);

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

  if (isDesktop) {
    new WOW().init();
  }

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


 /* $('#camera').camera({
    autoAdvance: false,
    mobileAutoAdvance: false,
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
  });*/

  /*modal bootstrap*/
  var modalVerticalCenterClass = ".modal";
  function centerModals($element) {
    var $modals;
    if ($element.length) {
      $modals = $element;
    } else {
      $modals = $(modalVerticalCenterClass + ':visible');
    }
    $modals.each( function(i) {
      var $clone = $(this).clone().css('display', 'block').appendTo('body');
      var top = Math.round(($clone.height() - $clone.find('.modal-content').height()) / 2);
      top = top > 0 ? top : 0;
      $clone.remove();
      $(this).find('.modal-content').css("margin-top", top);
    });
  }
  $(modalVerticalCenterClass).on('show.bs.modal', function(e) {
    centerModals($(this));
  });
  $(window).on('resize', centerModals);
  /*end modal*/

  /*validate contacts-form__form*/
  $('.content-form__form').validate({
    submitHandler: function(form){
      var form = document.forms.sendformcontacts,
        formData = new FormData(form),
        xhr = new XMLHttpRequest();

      xhr.open("POST", "sendmail.php");

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 2) {
          if(xhr.status == 200) {
            $(".content-form__form").html('<div class="content-form__form-tanks">Заявка успешно отправлена!<div>');
          }
        }
      };
      xhr.send(formData);
    },
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true
      }

    },
    messages: {
      name: {
        required: "Введите Ваше имя"
      },
      email: {
        required: "Введите адрес электронной почты",
        email: "Не корректный адрес"
      }
    }
  });

  /*validate modal__form*/
  $('.modal-content__form').validate({
    submitHandler: function(form){
      var form = document.forms.sendformpopup,
        formData = new FormData(form),
        xhr = new XMLHttpRequest();

      xhr.open("POST", "sendmail.php");

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 2) {
          if(xhr.status == 200) {
            $(".modal-content__form").html('<div class="modal-content__form-tanks">Заявка успешно отправлена!<div>');
          }
        }
      };
      xhr.send(formData);
    },
    rules: {
      name: {
        required: true,
      },
      email: {
        required: true,
        email: true
      }

    },
    messages: {
      name: {
        required: "Введите Ваше имя"
      },
      email: {
        required: "Введите адрес электронной почты",
        email: "Не корректный адрес"
      }
    }
  });

  /*** policy ***/
  $('.js-policy').on('click', function($el){
    checkPolicy();
  });
  /*** end policy ***/
  function checkPolicy () {
    if ($(".js-policy").is(':checked')) {
      $("[type=submit]").prop('disabled', false);
    } else {
      $("[type=submit]").prop('disabled', true);
    }
  };

  /*******inputfile******/

  var inputs = document.querySelectorAll( '.inputfile' );
  Array.prototype.forEach.call( inputs, function( input )
  {
    var label	 = input.nextElementSibling,
      labelVal = label.innerHTML;

    input.addEventListener( 'change', function( e )
    {
      var fileName = '';
      if( this.files && this.files.length > 1 )
        fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
      else
        fileName = e.target.value.split( '\\' ).pop();

      if( fileName )
        label.querySelector( 'span' ).innerHTML = fileName;
      else
        label.innerHTML = labelVal;
    });
  });

  /*******end inputfile******/

  /**
   * owl - js-photo-gallery
   */
  $('.js-photo-gallery').owlCarousel({
    animateOut: 'slideOutDown',
    animateIn: 'flipInX',
    items:4,
    margin:50,
    stagePadding:40,
    smartSpeed:450,
    //nav:true,
    //dots:false,
    loop:true,
    navElement: 'div class="owl-slider-arrow-photo-gallery"',
    navText:[],
    autoplay:false,
    autoplayTimeout:5000,
    autoplayHoverPause:true,
    responsive:{
      0:{
        items:1,
        nav:false,
        dots:true,
        //margin:30,
        //stagePadding:5,
      },
      480:{
        items:2,
        nav:false,
        dots:true,
      },
      992:{
        items:4,
        nav:true,
        dots:false,
      }
    }
  });

});

(function ($) {
  var o = document.getElementById("calculator");
  if (o) {
    include('dist/js/calculator.js');
  }
})
(jQuery);

(function ($) {
  var o = document.getElementById("feedback");
  if (o) {
    if (window.location.pathname=='/') {
      $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll >= 600) {
          $('.feedback').addClass('feedback_scroll');
        } else {
          $('.feedback').removeClass('feedback_scroll');
        }
        if (scroll == $(document).height() - $(window).height()) {
          $('.feedback').removeClass('feedback_scroll')
        }
      });
    } else {
      $('.feedback').addClass('feedback_scroll');
      $(window).scroll(function() {
        var scroll = $(window).scrollTop();
        if (scroll == $(document).height() - $(window).height()) {
          $('.feedback').removeClass('feedback_scroll')
        } else {
          $('.feedback').addClass('feedback_scroll');
        }
      });
    }
  }


})
(jQuery);


