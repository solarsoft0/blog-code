define(['jquery'], function($) {
	return {
		createDIV: function(id, cssClass, left, top, width) {
			return $("<div id='" + id + "' class='" + cssClass + "'></div>")
				.appendTo('body')
				.css({
					'display': 'block',
					'position': 'absolute',
					'left': left + 'px',
					'top': top + 'px',
					'width': width + 'px'
				});
		},
		
		generateGUID: function() {
			var d = new Date().getTime(),
				guid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
					var r = (d + Math.random() * 16) % 16 | 0;
					d = Math.floor(d / 16);
					return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
				});

			return guid;
		}
	};
});
