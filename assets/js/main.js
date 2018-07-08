$(function() {
window.scrollBy(0, -1);
mobileMenu();
//scrollMenu();
contactForm();

Common.Init();
});
function mobileMenu(){
  $(".mobile-nav-toggle").on('click', function(){
    var status = $(this).hasClass('is-open');
    if(status){
      $(".mobile-nav-toggle, .mobile-header").removeClass("is-open");
    }else{
      $(".mobile-nav-toggle, .mobile-header").addClass("is-open");
    }
});
}

/* Ajax Contact Form */
function contactForm() {
  // Get the form.
	var form = $('#ajax-contact');

	// Get the messages div.
	var formMessages = $('#form-messages');

	// Set up an event listener for the contact form.
	$(form).submit(function(e) {
		// Stop the browser from submitting the form.
		e.preventDefault();

		// Serialize the form data.
		var formData = $(form).serialize();

		// Submit the form using AJAX.
		$.ajax({
			type: 'POST',
			url: $(form).attr('action'),
			data: formData
		})
		.done(function(response) {
			// Make sure that the formMessages div has the 'success' class.
			$(formMessages).removeClass('error');
			$(formMessages).addClass('success');

			// Set the message text.
			$(formMessages).text(response);

			// Clear the form.
			$('#name').val('');
			$('#email').val('');
			$('#message').val('');
		})
		.fail(function(data) {
			// Make sure that the formMessages div has the 'error' class.
			$(formMessages).removeClass('success');
			$(formMessages).addClass('error');

			// Set the message text.
			if (data.responseText !== '') {
				$(formMessages).text(data.responseText);
			} else {
				$(formMessages).text('Oops! An error occured and your message could not be sent.');
			}
		});

	});

}

/*
function scrollMenu(){
  var top = 0;
  $(window).scroll(function(){
    var position =$(this).scrollTop();

    if (position > top && position > 500 ){
            //For devices with display smaller then 775px
            if ($(window).width()< 775) {
              $(".mobile-header, .novis-header").fadeOut();
            }else{
              $(".novis-header").fadeOut();
            }

    } else if(position < top-20) {

            if ($(window).width()< 775) {
              $(".novis-header, .mobile-header").fadeIn();
            }else{
              $(".novis-header").fadeIn();
                }
    }
    top = position;
});
}
*/


var Common = {
	countLines: function ($target) {
		// var style = $target.css(); // window.getComputedStyle(target, null);
		var height = parseInt( $target.css("height") );  // parseInt(style.getPropertyValue("height"));
		var font_size = parseInt( $target.css("font-size") );  // parseInt(style.getPropertyValue("font-size"));
		var line_height = parseInt( $target.css("line-height") );  // parseInt(style.getPropertyValue("line-height"));
		var box_sizing = $target.css("box-sizing");  // style.getPropertyValue("box-sizing");

		if(isNaN(line_height)) line_height = font_size * 1.2;

		if (box_sizing=='border-box') {
			var padding_top = parseInt($target.css("padding-top"));
			var padding_bottom = parseInt($target.css("padding-bottom"));
			var border_top = parseInt($target.css("border-top-width"));
			var border_bottom = parseInt($target.css("border-bottom-width"));
			height = height - padding_top - padding_bottom - border_top - border_bottom
		}
		var lines = Math.ceil(height / line_height);
		return lines;
	},
	coolText: function () {
		var $span = $(".span-wrap span").first().clone(true);
		$(".span-wrap span").remove();

		$.each($(".cool-text"), function (index, $coolText) {

			var $text = $(this).find(".text");
			var $spanWrap = $(this).find(".span-wrap");
			var linesNumber = Common.countLines($text);
			var elementDelay = parseFloat( $(this).attr("data-delay") );

			if ( Common.hasAttr($(this), "data-bgc") ) {
				var color = $(this).attr("data-bgc");
			} else {
				var color = "white";
			}

			var fontSize = parseFloat($text.css("font-size"));
			var textHeight = parseFloat($text.css("height"));
			var lineHeght = parseFloat( $text.css("line-height") );
			if ( isNaN(lineHeght) ) lineHeght = fontSize * 1.2;

			var add = (lineHeght - fontSize) / 2;

			$(this).css("height", textHeight);
			$spanWrap.css("height", textHeight);

			// var style =

			for ( var i = 0; i < linesNumber; i++ ) {

				var $spanClone = $span.clone(true);
				var delay = elementDelay + i/8;
					delay += "s";
				$spanClone.css({
					"background-color"  : color,
					"height"            : fontSize + add,
					"transition-delay"  : delay
				});
				$spanWrap.append($spanClone);
			}
		});
	},
	isScrolledIntoView: function (elem) {
		var docViewTop = $(window).scrollTop();
		var docViewBottom = docViewTop + $(window).height();

		var elemTop = $(elem).offset().top;
		var elemBottom = elemTop + $(elem).height();

		return (elemTop <= docViewBottom-100);
	},
	triggerAnimation: function () {

		function handleTriggering() {
			$('[data-animate]').each(function () {
				if (Common.isScrolledIntoView(this) === true) {
					$(this).addClass('animated');
				}
			});
		}
	
		$(window).scroll(function () {
			handleTriggering();
		});
		handleTriggering();

	},
	parallaxScroll: function () {
		var $parallaxElements = $("[data-parallax-effect]");

		$.each($parallaxElements, function (index, $parallaxElement) {
			var $element = $(this);
			var offset = $element.offset().top;
			var defaultTopPosition = $element.css("top");

			$(window).scroll( function () {
				if ( Common.isScrolledIntoView($element) ) {
					var docViewTop = $(window).scrollTop();
					var docViewBottom = docViewTop + $(window).height();
					var elPos = docViewBottom - offset;
					$element.css("top", elPos/8);
				} else {
					$element.css("top", defaultTopPosition);
				}
			});
		});
	},
	scrollToSection: function () {
		$("body").on("click", "a[href^='#']", function (e) {
			e.preventDefault();
			var sectionTarget = $(this).attr("href");
			var sectionPosition = $(sectionTarget).offset().top;

			$('body,html').animate({
				scrollTop : sectionPosition
			}, 500);

		});
	},
	hasAttr: function ($element, attrName) {
		var attr = $element.attr(attrName);
		if (typeof attr !== typeof undefined && attr !== false) {
			return true;
		}
	},
	Init: function () {
		this.coolText();
		this.triggerAnimation();
		this.parallaxScroll();
		this.scrollToSection();
	}
}