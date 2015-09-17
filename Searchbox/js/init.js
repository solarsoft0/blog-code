require.config({
	baseUrl: 'js',
	paths: {
		'jquery': 	 'https://code.jquery.com/jquery-1.11.2.min',
		'bootstrap': 'https://maxcdn.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min'
	},
	shim: {
		'bootstrap': { deps : [ 'jquery' ]}
	}
});

requirejs(['jquery', 'components/searchbox', 'bootstrap'], function($, searchbox) {
	$(document).ready(function() {
		$('#nav-search').mySearchBox( { bubbleClass: 'dark-bubble' } );
	});
});