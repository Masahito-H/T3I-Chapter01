$(function(){
  var $indexTabs,
  $indexElem,
  $indexLabel,
  $article = $("article"),
  $sectionWork,
  $sectionTarget,
  $button,

  $eventPrevButton = null,
  $eventPrevLabel = null,

  worksPositionsTop = [],
  scrollFunction = null,

  scrollTime = 500,
  scrollEasing = "easeOutExpo";

  $.getJSON("./portfolioData.json", function(data){
    let elements = [];

    $.each(data, function(i, item){

      let workHTML1 = `<section class="work" id="${item.id}">
                        <h2 class="work-title">${item.title}</h2>
                        <div class="work-genre">${item.genre}</div>`,
          workHTML2 = (item.thumbnail.isMovie) ? `<iframe width="560" height="315" src="${item.thumbnail.movsrc}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>` 
                      : `<a class="link-thumbnail" href="${item.thumbnail.imgsrc}"><img src="${item.thumbnail.imgsrc}" class="thumbnail" /></a>`,
          //workHTML2 = `<a class="link-thumbnail" href="${(item.thumbnail.isMovie) ? item.thumbnail.movsrc : item.thumbnail.imgsrc}"><img src="${item.thumbnail.imgsrc}" class="thumbnail" /></a>`,
          workHTML3 = ` ${(item.githubLink !== "") ? `<p><a class="github-link" href="${item.githubLink}" target="_blank"><span class='fab fa-github-square'></span><a></p>` : ""}
                        <p class="language">${item.language}</p>
                        ${item.describe}
                      </section>`,
          workHTML = "";

          workHTML = workHTML1 + workHTML2 + workHTML3;

      let $workHTML = $(workHTML),
      $anchorThumb = $workHTML.find("a.link-thumbnail");

      if(item.thumbnail.isMovie){
        //$anchor.addClass("work-mov-image");
      }
      else{
        $anchorThumb.addClass("work-image");
      }

      elements.push($workHTML.get(0));
    });

    $article.append(elements);

    $article.find("section a[class~='work-image']").colorbox({
      width: "80%"
    });

    $article.find("section a[class~='work-mov-image']").colorbox({
      iframe: true,
      innerWidth: "80%",
      innerHeight: "75%"
    });

    $article.find("section a[class='github-link']").stop(true).hover(function(){
      $(this).stop(true).animate({"opacity": "1"}, scrollTime, scrollEasing);
    }, function(){
      $(this).stop(true).animate({"opacity": ".5"}, scrollTime, scrollEasing);
    });

    worksPageConstructing();

  });

  //functions begin:
  function worksPageConstructing(){
    $indexTabs = $("#main-article");
    $indexElem = $indexTabs.find("#index-form input");
    $indexLabel = $indexTabs.find("#index-form label");
    $sectionWork = $("section.work");

    $button = $indexElem.button();
    scrollFunction = $.throttle(1000 / 15, function(){
      let articleHHalf = $article.height() / 2;

      $sectionWork.each(function(i){
        worksPositionsTop[i] = $(this).position().top - articleHHalf;
      });

      let targetValue = worksPositionsTop.map(function(value){
        if(value > 0){
          return Number.MIN_SAFE_INTEGER;
        }
        else{
          return value;
        }
      }).reduce(function(a, b){
        return Math.max(a, b);
      }),
      targetIndex = worksPositionsTop.indexOf(targetValue);

      let $targetButton = $indexElem.eq(targetIndex),
      $checkedButton = $("input[name='work']:checked");

      if($targetButton.attr("value") !== $checkedButton.attr("value")){
        $targetButton.prop("checked", true);

        panelAnimate($targetButton, false);
      }
    });

    $button.on("click", function(event){
      panelAnimate($(event.target), true);
    });
    $article.on("scroll", scrollFunction);

    $indexLabel.hover(function(){
      let $currentLabel = $(this);
      hoverAnimate(0, 1, $currentLabel);
    }, function(){
      let $currentLabel = $(this);
      hoverAnimate(1, 0, $currentLabel)
    });

    $indexElem.eq(0).prop("checked", true);
    panelAnimate($indexElem.eq(0), false);
  }

  function panelAnimate(button, isScroll){
    let borderC, borderF,
    $eventButton = button,
    $eventLabel = $eventButton.next(),
    $sectionTarget = $article.find(`#${$eventButton.attr("value")}`);

    if(isScroll){
      let top = $sectionTarget.position().top;

      borderC = 2;
      borderF = 3;

      $article.off("scroll");
      $article.stop(true)
          .animate({scrollTop: $article.scrollTop() + top}, {
            duration: scrollTime,
            easing: scrollEasing,
            complete: function(){
              $article.on("scroll", scrollFunction);
            }
          });
    }
    else{
      borderC = 0;
      borderF = 1;
    }

    if(($eventPrevButton) ? $eventButton.attr("value") !== $eventPrevButton.attr("value") : true){
      let $progressLabel = $eventLabel.stop(true);
      $({bgCol: 0}).stop(true).animate({bdCol: 1}, {
        duration: scrollTime,
        easing: scrollEasing,
        progress: function(){
          let colVal = colValGenerator(this.bdCol, "11");

          $progressLabel.css({"background-color": `rgb(${colVal[0]}, ${colVal[0]}, ${colVal[1]})`,
              "color": `rgb(${colVal[2]}, ${colVal[2]}, ${colVal[3]})`,
              "border-color": `rgb(${colVal[borderC]}, ${colVal[borderC]}, ${colVal[borderF]})`});
          }
      })
      if($eventPrevButton){
        let $progressPrevLabel = $eventPrevLabel.stop(true);
        $({bgCol: 1}).stop(true).animate({bdCol: 0}, {
          duration: scrollTime,
          easing: scrollEasing,
          progress: function(){
            let colVal = colValGenerator(this.bdCol, "11");

            $progressPrevLabel.stop(true).css({"background-color": `rgb(${colVal[0]}, ${colVal[0]}, ${colVal[1]})`,
              "color": `rgb(${colVal[2]}, ${colVal[2]}, ${colVal[3]})`,
              "border-color": `rgb(${colVal[0]}, ${colVal[0]}, ${colVal[1]})`});
          }
        });
      }

      $eventPrevButton = $eventButton;
      $eventPrevLabel = $eventLabel;
    }
  }

  function hoverAnimate(bf, af, $label){
    $({bdCol: bf}).animate({bdCol: af}, {
      duration: scrollTime,
      easing: scrollEasing,
      progress: function(){
        let $currentButton = $label.prev(),
        $checkedButton = $("input[name='work']:checked"),
        colVal = colValGenerator(this.bdCol, "11"),
        c, f;

        if($checkedButton && $currentButton.attr("value") === $checkedButton.attr("value")){
          c = colVal[2]; f = colVal[3]
        }
        else{
          c = colVal[0]; f = colVal[1];
        }

        $label.stop(true).css({"border-color": `rgb(${c}, ${c}, ${f})`});
      }
    });
  }

  function colValGenerator(bdCol, num16){
    let colVal12 = parseInt(num16, 16) + parseInt("BB", 16) * bdCol,
    colVal3 = parseInt(num16, 16) + parseInt("EE", 16) * bdCol;
    colVal12r = parseInt(num16, 16) + parseInt("BB", 16) * (1 - bdCol),
    colVal3r = parseInt(num16, 16) + parseInt("EE", 16) * (1 - bdCol);

    return [colVal12, colVal3, colVal12r, colVal3r];
  }
  //ここまで
  //functions end:
});
