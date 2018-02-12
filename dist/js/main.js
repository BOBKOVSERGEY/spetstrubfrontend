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

});

