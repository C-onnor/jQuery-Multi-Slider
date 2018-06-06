var perPage = 4; //items per page
var pageCount = Math.ceil($('.items > li').length / perPage); //amount of pages
var startIndex = 1; //start item of display group
var endIndex = perPage * $('.nav-pages > .selected').text(); //end item of display group
var currentPage = $('.nav-pages > .selected').text(); //current selected page
var maxPage = $('.nav-pages > li').last().text(); //last generated page
var animDelay = 200; //mill
var extraDelay = 200;

//animate.css integration
var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
var startAnimation = 'rollIn'; //animation to fade in
var endAnimation = 'rollOut'; //animation to fade out

//display new group
$.fn.extend({
  startAnimateGroupCss: function(animationName) {
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass(animationName);
    });

    fixHeight();
    setTimeout(function() {
      fixHeight();
    }, 150);
  }
});

$.fn.extend({
  startAnimateSingleCss: function(animationName) {
    $startGroup = $(this);

    $startGroup.each(function(i) {
      var $elem = $(this);
      setTimeout(function() {
        $elem.addClass('animated ' + startAnimation).one(animationEnd, function() {
          $elem.removeClass(startAnimation);
        });
      }, i * animDelay);
    });

    fixHeight();
    setTimeout(function() {
      fixHeight();
    }, 150);
  }
});

$.fn.extend({
  animateSingleCss: function(animationName, $startGroup) {
    $endGroup = $(this);

    $endGroup.each(function(i) {
      var $elem = $(this);
      setTimeout(function() {
        $elem.addClass('animated ' + animationName).one(animationEnd, function() {
          $elem.removeClass('animated ' + animationName);
        });
      }, i * animDelay);
    });

    //execute after animation exit
    setTimeout(function() {
      $startGroup.startAnimateSingleCss(startAnimation);
    }, (perPage * animDelay) + extraDelay); //until done animating out
  }
});

$.fn.extend({
  animateGroupCss: function(animationName, $startGroup) {
    this.addClass('animated ' + animationName).one(animationEnd, function() {
      $(this).removeClass('animated ' + animationName);
      $startGroup.startAnimateGroupCss(startAnimation);
    });
  }
});

function multiSlide() {
  pageCount = Math.ceil($('.items > li').length / perPage);

  //create pages
  for (i = 1; i <= pageCount; i++) {
    $('.nav-pages').append('<li class="page ' + i + '">' + i + '</li>');
  }

  $('.nav-pages > li.' + startIndex).addClass('selected');

  //paginate
  paginate();
}

function paginate() {
  oldEndIndex = endIndex;
  oldStartIndex = startIndex;
  oldAnimDelay = animDelay;
  endIndex = perPage * $('.nav-pages > .selected').text();
  startIndex = endIndex - perPage;

  /* single page animation 
  if ( $('.items > .animated').length == 0 ){
	$('.items > li').slice(startIndex, endIndex).startAnimateGroupCss(startAnimation);
  } else {
    $startGroup = $('.items > li').slice(startIndex, endIndex);
    $('.items > li').slice(oldStartIndex, oldEndIndex).animateGroupCss(endAnimation, $startGroup);
  }*/

  /* single item animation */
  if ($('.items > .animated').length == 0) {
    $('.items > li').slice(startIndex, endIndex).startAnimateSingleCss(startAnimation);
  } else {
    $startGroup = $('.items > li').slice(startIndex, endIndex);
    $('.items > li').slice(oldStartIndex, oldEndIndex).animateSingleCss(endAnimation, $startGroup);
  }
}

function pageClick($i) {
  if (!$i.hasClass('selected')) {
    $('.nav-pages > .selected').removeClass('selected');
    $i.addClass('selected');
  }
}

function prevClick($i) {
  maxPage = $('.nav-pages > li').last().text();
  currentPage = $('.nav-pages > .selected').text();

  if (currentPage == 1) {
    newPage = maxPage;
  } else {
    newPage = parseInt(currentPage) - 1;
  }

  elem = '.nav-pages > .' + newPage;

  $('.selected').removeClass('selected');
  $(elem).addClass('selected');
}

function nextClick($i) {
  maxPage = $('.nav-pages > li').last().text();
  firstPage = $('.nav-pages > li').first().text();
  currentPage = $('.nav-pages > .selected').text();

  if (currentPage == maxPage) {
    newPage = firstPage;
  } else {
    newPage = parseInt(currentPage) + 1;
  }

  elem = '.nav-pages > .' + newPage;

  $('.nav-pages > .selected').removeClass('selected');
  $(elem).addClass('selected');
}

function fixHeight() {
  $('.items, .nav-arrows').height($('.items > li').not('.animated').height());
}

$(document).ready(function() {
  multiSlide();
  fixHeight();
  setTimeout(function() {
    fixHeight();
  }, 150);

  //on click events
  $('.nav-pages > li').bind('click', function() {
    pageClick($(this));
    paginate();
  });

  $('.nav-arrows > .prev').bind('click', function() {
    prevClick($(this));
    paginate();
  });

  $('.nav-arrows > .next').bind('click', function() {
    nextClick($(this));
    paginate();
  });
});

$(window).bind('resize', function() {
  fixHeight();
  setTimeout(function() {
    fixHeight();
  }, 150);
});
