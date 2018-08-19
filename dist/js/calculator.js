$(function() {
  if($(".calc-bg").length) {
    var tType = $(".calc-bg select[name=type]").val();
    turnOnCalc(tType);

    $(".calc-bg select[name=type]").on("change", function() {
      $(".calc-bg input").removeClass("error-field");
      tType = $(this).val();
      turnOnCalc(tType);
    });

    $(".calc-bg button[name=submit]").on("click", function() {
      calculate(tType);
      return false;
    });

    $(".calc-bg button[name=reset]").on("click", function() {
      $(".calc-bg .img-cont").css("background-image", "url(dist/images//rect.svg)");
      $(".calc-bg .measure").hide();
      $(".calc-bg input[name='price-meter']").prop("disabled", false);
      $(".calc-bg input[name='price-ton']").prop("disabled", false);
    });

    $(".calc-bg input").focusin(function() {
      var measure = $(this).data("measure");
      if(measure != "") {
        $(this).data("measure-show", measure);
      }
      $(this).removeClass("error-field");
    });

    $(".calc-bg input").keypress(function(e) {
      if (!(e.which==8 || e.which==44 ||e.which==45 ||e.which==46 ||(e.which>47 && e.which<58))) {
        return false;
      }
    });

    $(".calc-bg input").keyup(function(e) {
      if($(this).val()!="") {
        $(this).siblings(".measure").show();
      } else {
        $(this).siblings(".measure").hide();
      }
    });

    $(".calc-bg input[name='price-meter']").keyup(function(e) {
      if($(this).val()!="") {
        $(".calc-bg input[name='price-ton']").prop("disabled", true);
      } else {
        $(".calc-bg input[name='price-ton']").prop("disabled", false);
      }
    });
    $(".calc-bg input[name='price-ton']").keyup(function(e) {
      if($(this).val()!="") {
        $(".calc-bg input[name='price-meter']").prop("disabled", true);
      } else {
        $(".calc-bg input[name='price-meter']").prop("disabled", false);
      }
    });
  }

  function checkFields() {
    var checked = true;
    return checked;
  }

  function calculate(tType) {
    var answer = "<p><strong>Итоговый расчет:</strong></p>";
    var f;
    var ro = Number($("select[name=material]").val());
    var error = false;

    var sRaf = $("input[name=size-s]").val();
    if(sRaf<=0) {
      error = true;
      $("input[name=size-s]").addClass("error-field");
    }
    var temp = sRaf.indexOf(',');
    if (temp != '-1') {
      temp = sRaf.split(',');
      sRaf = temp[0]+'.'+temp[1];
    }
    var s = parseFloat(sRaf); // Толщина стенки


    var lRaf = $("input[name=size-l]").val();
    temp = lRaf.indexOf(',');
    if (temp != '-1') {
      temp = lRaf.split(',');
      lRaf = temp[0]+'.'+temp[1];
    }
    var l = parseFloat(lRaf); // Длина трубы

    switch(tType) {
      case "circle":
        //size-d
        f = "m = Pi * ro * S * (D - S) * L";
        var d = Number($("input[name=size-d]").val()); //Диаметр
        if(d<=0) {
          error = true;
          $("input[name=size-d]").addClass("error-field");
        }
        iWeight = ( Math.PI * ro * (s/1000) * (d/1000 - s/1000) * 100) / 100;
        a = "d" + d;
        b = "";
        break;

      case "square":
        //size-a
        var a = Number($("input[name=size-a]").val()); //сторона квадрата
        if(a<=0) {
          error = true;
          $("input[name=size-a]").addClass("error-field");
        }
        f = "m = ro / 7850 * 0.0157 * S * (2 * a - 2.86 * S) * L";
        iWeight = ( (ro / 7850) * 0.0157 * s * ( 2 * a - 2.86 * s) * 100) / 100;
        a = a + "x" + a;
        b = "";
        break;

      case "rect":
        //size-a, size-b
        var a = Number($("input[name=size-a]").val()); //сторона a прямоугольника
        if(a<=0) {
          error = true;
          $("input[name=size-a]").addClass("error-field");
        }
        var b = Number($("input[name=size-b]").val()); //сторона b прямоугольника
        if(b<=0) {
          error = true;
          $("input[name=size-b]").addClass("error-field");
        }
        f = "m = ro / 7850 * 0.0157 * S * (A + B - 2.86 * S) * L";
        iWeight = ( (ro / 7850) * 0.0157 * s * ( a + b - 2.86 * s) * 100) / 100;
        a = a+"x";
        break;
    }

    if(error) {
      return false;
    }

    iWeight = ( iWeight * 100 ) / 100;
    iWeight = (iWeight <= 0) ? "Ошибка" : iWeight.toFixed(3);
    answer = answer + "<p>Вес трубы <span class=\"result\">"+a+b+"x"+s+"</span> длиной 1м: <span class=\"result\">"+iWeight+" кг</span></p>";

    if(l > 0) {
      iWeightLength = ( iWeight * 100 * l ) / 100;
      if ( iWeightLength  <= 0 ) iWeightLength = "Ошибка"; else iWeightLength = iWeightLength.toFixed(3)+" кг";
      answer = answer + "<p>Вес трубы "+a+b+"x"+s+" длиной "+l+"м: <span class=\"result\">"+iWeightLength+"</span></p>";
    }

    var priceMeter = Number($("input[name=price-meter]").val());
    if(priceMeter > 0) {
      var calcPriceTon = priceMeter * 1000/iWeight;
      calcPriceTon = (calcPriceTon<=0) ? "Ошибка" : calcPriceTon.toFixed(2);
      answer = answer + "<p>Цена за тонну: <span class='result'>" + calcPriceTon + "</span></p>";
    }

    var priceTon = Number($("input[name=price-ton]").val());
    if(priceTon > 0) {
      var calcPriceMeter = iWeight * priceTon/1000;
      calcPriceMeter = (calcPriceMeter<=0) ? "Ошибка" : calcPriceMeter.toFixed(2);
      answer = answer + "<p>Цена за метр: <span class='result'>" + calcPriceMeter + "</span></p>";
    }

    var weightTotal = Number($("input[name=weight-total]").val());
    if(weightTotal > 0) {
      var calcWeightTotal = weightTotal/iWeight;
      calcWeightTotal = (calcWeightTotal<=0) ? "Ошибка" : calcWeightTotal.toFixed(3);
      answer = answer + "<p>Количество метров: <span class='result'>" + calcWeightTotal + "</span></p>";
    }

    $(".calc-total").html(answer + "<p>Плотность материала: <span class='result'>"+ro+" кг/м<sup>2<sup></span></p>"
    );

  }

  function turnOnCalc(tType) {
    var listOn, listOff;

    switch(tType) {
      case "circle":
        listOn = ["d"];
        listOff = ["a", "b"];
        break;

      case "square":
        listOn = ["a"];
        listOff = ["b", "d"];
        break;

      case "rect":
      default:
        listOn = ["a", "b"];
        listOff = ["d"];
        break;
    }
    inputSwitcher(listOn, listOff);
    imgSwitcher(tType);
  }

  function imgSwitcher(tType) {
    var img = [];
    img["circle"] = "dist/images/circle.svg";
    img["square"] = "dist/images/square.svg";
    img["rect"] = "dist/images/rect.svg";

    $(".calc-bg .img-cont").css("background-image", "url("+img[tType]+")");
  }

  function inputSwitcher(listOn, listOff) {
    for(var i=0; i<listOn.length; i++) {
      var inputName = "size-" + listOn[i];
      $("input[name="+inputName+"]").prop("disabled",false);
    }

    for(var i=0; i<listOff.length; i++) {
      var inputName = "size-" + listOff[i];
      $("input[name="+inputName+"]").prop("disabled",true);
    }
  }

  function validate(inp) {
    inp.value = inp.value.replace(/[^\d,.]*/g, '')
      .replace(/([,.])[,.]+/g, '$1')
      .replace(/^[^\d]*(\d+([.,]\d{0,5})?).*$/g, '$1');
  }

  var twoCalculator = $('#calculator2').detach();
  var threeCalculator = $('#calculator3').detach();

  $('#dropdown1-tab').on('click', function () {
    var oneCalculator = $('#calculator').detach();
    var elPlaceCalculator = $('.placecalculator');
    elPlaceCalculator.append(twoCalculator);
    $('#trubnyicalc').on('click', function () {
      $('#calculator2').detach();
      $('#home').append(oneCalculator);
    })
  })
  $('.dropdown-menu li').on('click', function () {
    $('.raschety-3').addClass('col-md-3');
    $('.raschety-9').addClass('col-md-9');
  })

  /*
 $('#normazagruzki').on('click', function () {
    var elCalculator = $('#calculator .calc-bg');
    elCalculator.removeClass('calc-bg');
  });

  $('#trubnyicalc').on('click', function () {
    var elCalculatorSmall = $('#calculatorsmall ');
    elCalculatorSmall.remove();
  })
  $('#trubnyicalc').on('click', function () {
    var elCalculator = $('#calculator');
    //var elCalculatorSmall = $('#calculatorsmall');
    $('#home').append('Ghbdt');
  })*/

});