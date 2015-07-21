/// <binding BeforeBuild='build' />
var gulp = require('gulp'),
    less = require('gulp-less');

var config = {
    src: './Client',
    dest: './wwwroot'
};

var files = {
    html: config.src + '/**/*.html',
    less: config.src + '/style/bundle.less'
};

gulp.task('build', ['style', 'html']);

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
