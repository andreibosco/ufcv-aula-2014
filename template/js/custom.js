(function($) {
  $.fn.hasScrollBar = function() {
      return this.get(0).scrollHeight > this.innerHeight();
  };
  $.fn.elementRealWidth = function () {
    var $clone = this.clone()
        .css("visibility","hidden")
        .appendTo($('body'));
    var $width = $clone.outerWidth();
    $clone.remove();
    return $width;
  };
})(jQuery);

function sidebarAdjustWidth(element,width,direction) {
  if (element.hasScrollBar()) {
    var newWidth = width + 10;
    element.css("width",newWidth);
    if (direction === "right") {
      element.css("right",-newWidth);
    } else if (direction === "left") {
      element.css("left",-newWidth);
    }
           
  } else {
    element.css("width",width);
  }
}

function slideNumbers(index,total) {
  var $slideCurrent = $("#submenu .slide-current");
  var $slideTotal = $("#submenu .slide-total");
  $slideCurrent.add($slideTotal).empty();
  $slideCurrent.append(index);
  $slideTotal.append(" / "+total);
}

$(document).ready(function(){
  // variáveis gerais
  var $window = $(window);
  var $sidebar = $("#sidebar");
  var $subsidebar = $("#subsidebar");

  // sidebar (menu)
  $(".pure-menu-heading").click(function(){
    var $sidebarOffset = $sidebar.offset();
    if ($sidebarOffset.left < 0) {
      $sidebar.animate({
        left: "0px"
      }, 300);
    } else {
      $sidebar.animate({
        left: "-"+$sidebar.width()
      }, 300);
    }
  });

  // subsidebar (slides)
  $("#submenu a").click(function(event){
    event.preventDefault();
    var $subsidebarOffset = $subsidebar.offset();
    if ($subsidebarOffset.left === $window.width()) {
      $subsidebar.animate({
        right: "0px"
      }, 300);
    } else {
      $subsidebar.animate({
        right: "-"+$subsidebar.width()
      }, 300);
    }
  });

  // botões de seções na barra de navegação e anchor dos slides
  $("#main .slide").each(function(index){
    // iniciando index em 1 (necessário para funcionar corretamente com o script fullPage)
    index++;
    // gerando anchor dos slides
    $(this).attr("data-anchor","slide"+index);
    // obter o tipo de seção
    var $sectionType = $(this).data("section-type");
    // criar item de navegação correspondente
    $("#subsidebar .list").append("<li data-slide-target='slide"+index+"'><a href='#/slide"+index+"'><span class='icon-"+$sectionType+"'></span></a></li>" );
  });

  // tamanho da fonte
  var fontSmall = "12";
  var fontMedium = "16";
  var fontLarge = "20";
  var fontCookie = "UFCV-Aula-2014";
  var fontSize = fontMedium;
  // verifica se o cookie que armazena o tamanho da fonte já existe, do contrario o cria
  if ($.cookie(fontCookie)) {
    fontSize = $.cookie(fontCookie);
    // define o tamanho inicial da fonte da página
    $("#main").css("font-size", fontSize + "px");
    // adiciona classe indicando qual o tamanho atual da fonte 
    if (fontSize === fontSmall) {
      $(".font.small").addClass("current");
    }
    else if (fontSize === fontMedium) {
      $(".font.medium").addClass("current");
    }
    else {
      $(".font.large").addClass("current");
    }
  }
  else {
    $(".font.medium").addClass("current");
    $.cookie(fontCookie, fontSize);
  }
  // link da fonte grande
  $(".font").bind("click", function(event){
    event.preventDefault();
    if ($(this).hasClass("small")) {
      fontSize = fontSmall;
    }
    else if ($(this).hasClass("medium")) {
      fontSize = fontMedium;
    }
    else {
      fontSize = fontLarge;
    }
    $("#main").animate({"font-size": fontSize + "px"});
    $(".font").removeClass("current");
    $(this).addClass("current");
    $.cookie(fontCookie, fontSize);
  });

  // slider das seções
  $.fn.fullpage({
    verticalCentered: false,
    slidesNavigation: false,
    scrollOverflow: false,
    loopBottom: false,
    loopTop: false,
    loopHorizontal: false,
    resize: false,
    disableKeyboard: true,
    touch: false,
    afterRender: function() {
      // indicando o slide atual
      $("#subsidebar li[data-slide-target=slide1]").addClass("current");
      $(".controlArrow").hide();
      // desabilitando botão de navegação voltar
      $("#navigation .previous").addClass('disabled');
      // inicializando contador de slides
      var slidesTotal = $(".slide").size();
      slideNumbers("1",slidesTotal);
    },
    afterSlideLoad: function(anchorLink, index, slideAnchor, slideIndex) {
      // variáveis
      var slidesTotal = $(".slide").size();
      // atualizando número do slide atual na barra de navegação
      slideNumbers(slideIndex+1,slidesTotal);
      // habilitando classe current apenas para o slide sendo exibido
      $("#subsidebar li").removeClass("current");
      $("#subsidebar li[data-slide-target="+slideAnchor+"]").addClass("current");
      // adicionando classe disable nas setas de navegação ao chegar no início ou fim
      if (slideIndex === 0) {
        $("#navigation .previous").addClass('disabled');
      }
      else if (slideIndex === slidesTotal-1) {
        $("#navigation .next").addClass('disabled');
      }
      else {
        $("#navigation .previous, #navigation .next").removeClass("disabled");
      }
    }
  });

  //botões de avançar e voltar e desabilitando ao chegar no primeiro ou último slide
  $("#navigation .previous").click(function(event){
    event.preventDefault();
    if ($(".section.active .slide.active").data('anchor') !== "slide1") {
      $(".section.active").find(".controlArrow.prev").trigger("click");
    }
  });
  $("#navigation .next").click(function(event){
    event.preventDefault();
    var slidesTotal = $(".slide").size();
    var lastSlide = "slide"+slidesTotal;
    if ($(".section.active .slide.active").data('anchor') !== lastSlide) {
      $(".section.active").find(".controlArrow.next").trigger("click");
    }
  });

  // redimensionando sidebars se necessário (altura e largura)
  var $sidebarHeight = $window.height() - $("#navigation").height() + 2;
  var $sidebarWidth = $sidebar.elementRealWidth();
  var $subsidebarWidth = $subsidebar.elementRealWidth();
  sidebarAdjustWidth($subsidebar,$subsidebarWidth, "right");
  sidebarAdjustWidth($sidebar,$sidebarWidth, "left");
  $sidebar.add($subsidebar).css("height",$sidebarHeight);
});

$(window).resize(function(){
  // variáveis
  var $sidebar = $("#sidebar");
  var $subsidebar = $("#subsidebar");
  var $sidebarHeight = $(window).height() - $("#navigation").height() + 2;
  // redimensionando sidebars se necessário (altura e largura)
  sidebarAdjustWidth($subsidebar, 60, "right");
  sidebarAdjustWidth($sidebar, 185, "left");
  $sidebar.add($subsidebar).css("height",$sidebarHeight);
});