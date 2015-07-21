/// <binding BeforeBuild='build' />
var gulp = require('gulp'),
  browserify = require('browserify'),
  eslint = require('gulp-eslint'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream');

var config = {
    src: './Client',
    dest: './wwwroot'
};

var files = {
    entry: config.src + '/app.jsx',
    code: [ config.src + '/**/*.js', config.src + '/**/*.jsx' ],
    html: config.src + '/**/*.html',
    less: config.src + '/style/bundle.less'
};

gulp.task('build', ['style', 'html', 'bundle']);

gulp.task('html', function ()
{
    return gulp.src([files.html]).pipe(gulp.dest(config.dest));
});

gulp.task('style', function ()
{
    return gulp.src([files.less])
        .pipe(less())
        .pipe(gulp.dest(config.dest));
});

gulp.task('eslint', function ()
{
    return gulp.src(files.code)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('bundle', ['eslint'], function ()
{
    var bundler = browserify({
        extensions: ['.js', '.jsx'],
        transform: ['babelify'],
        debug: true
    });

    return bundler.add(files.entry)
        .bundle()
        .pipe(source(files.entry))
        .pipe(rename('bundle.js'))
        .pipe(gulp.dest(config.dest));
});
