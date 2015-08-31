/*--slide out menus--*/
(function($) {
    $(document).ready(function() {
      $.slidebars();
    });
  }) (jQuery);

/*--assignment slider--*/
$(document).ready(function(){
  //if statement prevents errors on pages without bxslider
});

/*--tooltipster plugin--*/
$(document).ready(function() {
    // $('.tooltip').tooltipster({
        // maxWidth: 300
    // });
});

//hides up/down votes upon clicking//
$(".su1").click(function(){
    $(".sd1").hide();
});

$(".sd1").click(function(){
    $(".su1").hide();
});

$(".su2").click(function(){
    $(".sd2").hide();
});

$(".sd2").click(function(){
    $(".su2").hide();
});

$(".su3").click(function(){
    $(".sd3").hide();
});

$(".sd3").click(function(){
    $(".su3").hide();
});

$(".su4").click(function(){
    $(".sd4").hide();
});

$(".sd4").click(function(){
    $(".su4").hide();
});

$(".su5").click(function(){
    $(".sd5").hide();
});

$(".sd5").click(function(){
    $(".su5").hide();
});

$(".su6").click(function(){
    $(".sd6").hide();
});

$(".sd6").click(function(){
    $(".su6").hide();
});

