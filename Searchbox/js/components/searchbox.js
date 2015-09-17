define([
	'jquery', 
	'components/utils'
], function($, utils) {
	
	$.fn.mySearchBox = function(pOptions) {
	
		var options = $.extend({
			bubbleClass: 'bubble'
		}, pOptions || {});
		
		return $(this).each(function() {
			$(this).data('my-searchbox', new $.MySearchBox($(this), options));
		});
	};

	$.MySearchBox = function(pElement, pOptions) {
		var clickElem = pElement,
			options = pOptions,
		    searchId = utils.generateGUID();

		// Click Handler definition for this Searchbox
		function onClick(evt) {
			var elem = $(evt.currentTarget), data = evt.data, srch = $('#' + data.searchId);

			// If the search box exists, remove it and move on.
			if (srch.length > 0) {
				srch.remove();
				return;
			}

			// Calculate the best location for the box.  It needs to align
			// with the left edge of the search icon (-8 pixels) and be
			// 4 pixels below the bottom edge.
			var left = elem.position().left - 22,
				top = elem.position().top + elem.height() + 12,
				maxWidth = 350;

			// Calculate the best width for the box.  It should not go
			// over the size of the screen
			var width = ((left + maxWidth) < $(window).width()) ? maxWidth : $(window).width() - left;

			// IF the search box does not exist, then we need to create it.
			var div = utils.createDIV(data.searchId, options.bubbleClass, left, top, width)
				.html("<div class='search'><input type='search' name='search' placeholder='Search'></div>");

			// Focus on the search box
			$('input[type=search]', div).focus();
		}

		function onBodyClick(evt) {
			var s = $('#' + searchId);
			if (s.length > 0) {
				if (utils.isLocatedIn(evt.pageX, evt.pageY, clickElem) || utils.isLocatedIn(evt.pageX, evt.pageY, s))
					return;
				s.remove();
			} 
		}

		// Register the click handler on our icon
		pElement.css({ 'cursor': 'pointer' }).click({ 'searchId': searchId }, onClick);

		// Public Interface
		return {
			// Return a jQuery reference for the search box, or null
			getSearchBox: function () {
				var s = $('#' + searchId);
				return (s.length > 0) ? s : null;
			},
		};
	};
});