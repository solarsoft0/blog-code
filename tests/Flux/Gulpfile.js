var gulp = require('gulp'),
  browserify = require('browserify'),
  eslint = require('gulp-eslint'),
  less = require('gulp-less'),
  rename = require('gulp-rename'),
  source = require('vinyl-source-stream');

var config = {
  src: './client',
  dest: './public'
};

var files = {
  entry: config.src + '/app.jsx',
  html: config.src + '/**/*.html',
  js: config.src + '/**/*.js',
  jsx: config.src + '/**/*.jsx',
  less: config.src + '/style/bundle.less',
  style: config.src + '/style/*.less'
};

gulp.task('eslint', function () {
  return gulp.src([ files.js, files.jsx ])
    .pipe(eslint())
    .pipe(eslint.format());
});

gulp.task('copyhtml', function () {
  return gulp.src([ files.html ])
    .pipe(gulp.dest(config.dest))
});

gulp.task('bundle', [ 'eslint', 'copyhtml' ], function () {
  var bundler = browserify({
    extensions: ['.js', '.jsx'],
    transform: ['babelify'],
    debug: true
  });

  return bundler
    .add(files.entry)
    .bundle()
    .on('error', function(err) {
      console.error(err.toString());
    })
    .pipe(source(files.entry))
    .pipe(rename('bundle.js'))
    .pipe(gulp.dest(config.dest));
});

gulp.task('style', function () {
  return gulp.src([files.less])
    .pipe(less())
    .pipe(gulp.dest(config.dest));
});

gulp.task('watch', [ 'style', 'bundle' ], function() {
  gulp.watch([files.html], ['copyhtml']);
  gulp.watch([files.js, files.jsx], ['bundle']);
  gulp.watch([files.style], ['style']);
});
