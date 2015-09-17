var gulp = require('gulp'),
  browserify = require('browserify'),
  eslint = require('gulp-eslint'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream');

gulp.task('eslint', function () {
  return gulp.src([ './client/**/*.jsx', './client/**/*.js' ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('bundle', [ 'eslint' ], function () {
  var bundler = browserify({
    extensions: ['.js', '.jsx'],
    transform: ['babelify'],
    debug: true
  });

  return bundler
    .add('./client/app.jsx')
    .bundle()
    .on('error', function(err) {
      console.error(err.toString());
    })
    .pipe(source('./client/app.jsx'))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest('public/'));
});

gulp.task('style', function () {
  return gulp.src(['./client/style/bundle.less'])
    .pipe(less())
    .pipe(gulp.dest('./public'));
});

gulp.task('watch', [ 'style', 'bundle' ], function() {
  gulp.watch(['./client/**/*.js', './client/**/*.jsx'], ['bundle']);
  gulp.watch(['./client/**/*.less'], ['style']);
});
