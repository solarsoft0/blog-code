/// <binding BeforeBuild='build' />
var gulp = require('gulp'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream');

var config = {
    src: './src',
    dst: './www'
};

var files = {
    entry: config.src + '/js/index.js'
};

gulp.task('build', ['bundle']);

gulp.task('bundle', function () {
    var bundler = browserify({
        extensions: ['.js', '.jsx'],
        transform: [babelify],
        debug: true
    });

    return bundler.add(files.entry).bundle()
        .pipe(source(files.entry))
        .pipe(rename('index.js'))
        .pipe(gulp.dest(config.dst + '/scripts'));
});
