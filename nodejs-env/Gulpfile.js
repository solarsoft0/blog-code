var gulp = require('gulp'),
    eslint = require('gulp-eslint'),
    sass = require('gulp-sass');

var serverFiles = [
  'app.js',
  './controllers/**/*.js',
  './server/**/*.js'
];

gulp.task('default', [ 'scripts', 'stylesheets' ]);

gulp.task('lint', function () {
    return gulp.src(serverFiles)
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failOnError());
});

gulp.task('scripts', [ 'lint' ]);

gulp.task('stylesheets', function () {
  return gulp.src('stylesheets/main.scss')
    .pipe(sass())
    .pipe(gulp.dest('wwwroot/style'));
});
