$(function(){
  let $wd = $(window),
  $menuIcon = $(".menu-icon"),
  $menu = $("#g-nav"),
  $closeIcon = $(".close-icon"),

  isSaveNone = false,

  aDuration = 150,
  aEasing = "linear";

  $wd.on("load resize", mediaMatchMenu);
  $menuIcon.on("click", openMenu);
  $closeIcon.on("click", closeMenu);

  function mediaMatchMenu(event){
    if(window.matchMedia("screen and (max-width:768px)").matches){
      if(isSaveNone === true){
        $menu.css({display: "none"});
        $menu.css({opacity: 0});

        isSaveNone = false;
      }
    }
    else{
      if($menu.css("display") === "none"){
        $menu.css({display: "block"});
        $menu.css({opacity: 1});

        isSaveNone = true;
      }
    }
  }

  function openMenu(event){
    $menuIcon.css({display: "none"});
    $closeIcon.css({display: "inline-block"});
    $menu.css({display: "block"});

    $menuIcon.animate({opacity: 0}, aDuration, aEasing);
    $closeIcon.animate({opacity: 1}, aDuration, aEasing);
    $menu.animate({opacity: 1}, aDuration, aEasing);
  }

  function closeMenu(event){
    $menuIcon.css({display: "inline-block"});
    $closeIcon.css({display: "none"});
    $menu.css({display: "none"});

    $menuIcon.animate({opacity: 1}, aDuration, aEasing);
    $closeIcon.animate({opacity: 0}, aDuration, aEasing);
    $menu.animate({opacity: 0}, aDuration, aEasing);
  }
});
