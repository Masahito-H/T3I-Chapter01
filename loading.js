$(function(){
  loading();

  function loading(){
    var $progress = $(".loading-screen"),
    $pBar = $progress.find(".progress-express"),
    $pText = $progress.find(".progress-text"),
    $pTextSpan = $pText.find("span"),

    barDuration = 500,
    loadedDuration = 1000,
    easing = "easeOutQuart",

    spanTimer,

    imgLoad = imagesLoaded("body"),

    imgLength = (imgLoad.images.length > 0) ? imgLoad.images.length : 1,
    imgLoaded = (imgLoad.images.length > 0) ? 0 : 1,
    loadingProgress = 0,
    current = 0;

    updateProgress();

    imgLoad.on("progress", function(){
      imgLoaded++;
      loadingProgress = (imgLoaded / imgLength) * 100;
      updateProgress();
    })

    function updateProgress(){
      loadingProgress = (imgLoaded / imgLength) * 100;
      $pText.text(`${Math.floor(loadingProgress)}%`);
      $pBar.stop(true)
          .animate({width: `${loadingProgress}%`}, barDuration, easing);

      if(loadingProgress >= 100){
        promiseEndAnimateStep1().then(
          (response) => {
            return promiseEndAnimateStep2();
          },
          (error) => {}
        ).then(
          (response) => {
            return promiseEndAnimateStep3();
          },
          (error) => {}
        );
      }

      function promiseEndAnimateStep1(){
        return new Promise((resolve, reject) => {
          setTimeout(() => { resolve(); }, barDuration - 235);
        });
      }

      function promiseEndAnimateStep2(){
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            $pText.html("LOADING<span>.</span>")
            spanTimer = $pText.find("span");
            setInterval(spanToggler, 1000 / 10);

            $pText.delay(loadedDuration - 100)
                .animate({opacity: 0}, barDuration, easing);
          }, 100);

          setTimeout(() => {
            $pBar.animate({height: 0}, barDuration, easing);
          }, loadedDuration - 100);

          setTimeout(() => {
            $progress.animate({opacity: 0}, barDuration, "linear");
          }, loadedDuration - 100);

          setTimeout(() => {
            clearInterval(spanToggler);
            resolve();
          }, loadedDuration + barDuration);
        });
      }

      function promiseEndAnimateStep3(){
        return new Promise((resolve, reject) => {
          $progress.css({display: "none"});
          $(".main-body").animate({opacity: 1}, 5000, "linear");
          resolve();
        });
      }

      function spanToggler(){
        spanTimer.toggleClass("spanToggle");
      }
    }
  }
})
