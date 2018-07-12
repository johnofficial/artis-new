$(function() {

contactForm();

setTimeout(function () {
	$(".preloader").addClass("animated");
	Common.Init();
	setTimeout(function () {
		Common.triggerAnimation();
	}, 1200);
}, 1000);

});

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
	toggleMobileMenu: function (){
		$(".hamburger-toggle").on("click", function(){
			$(this).toggleClass("open-menu");
			$(".mobile-header-wrap, .mobile-navigation-wrap").toggleClass("open-menu");
		});
	},
	parallaxScroll: function () {
		var $parallaxElements = $("[data-parallax-effect]");

		$.each($parallaxElements, function (index, $parallaxElement) {
			var $element = $(this);
			var direction = $element.attr("data-parallax-effect");
			var offset = $element.offset().top;
			var defaultTopPosition = $element.css("top");

			function handleParallax() {
				if ( Common.isScrolledIntoView($element) ) {
					var docViewTop = $(window).scrollTop();
					var docViewBottom = docViewTop + $(window).height();
					var elPos = (docViewBottom - offset)/10;
					var top = direction+elPos + "px";
					$element.css({
						"-webkit-transform": "translateY("+top+")",
						"-moz-transform":  "translateY("+top+")",
						"-ms-transform":  "translateY("+top+")",
						"-o-transform": "translateY("+top+")",
						"transform":  "translateY("+top+")"
					});
				} else {
					$element.css("top", defaultTopPosition);
				}
			}
			$(window).scroll( function () {
				handleParallax();
			});
			handleParallax();
		});
	},
	handleLinkClick: function () {
		$("body").on("click", "a:not([target='_blank'], [href^='tel:'], [href^='mailto:'])", function (e) {
			e.preventDefault();
			var href = $(this).attr("href");

			if ( href[0] == "#" ) {
				var sectionTarget = $(this).attr("href");
				var sectionPosition = $(sectionTarget).offset().top;
				$('body,html').animate({
					scrollTop : sectionPosition
				}, 500);
			} else {
				$(".preloader").removeClass("animated");
				setTimeout(function(){window.location.href = href;}, 1000);
			}
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
		this.parallaxScroll();
		this.handleLinkClick();
		this.toggleMobileMenu();
	}
}