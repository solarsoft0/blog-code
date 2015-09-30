var gulp = require('gulp'),
    babelify = require('babelify'),
    browserify = require('browserify'),
    buffer = require('vinyl-buffer'),
    del = require('del'),
    eslint = require('gulp-eslint'),
    less = require('gulp-less'),
    path = require('path'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    uglify = require('gulp-uglify'),
    config = require('./package.json').gulpConfig;

var copyExtensions = [ '.html', '.png', '.jpg', '.ico' ],
    jsExtensions = [ '.js', '.jsx' ];

/*****************************************************************************
**
** GULP TASK: DEFAULT
**
** Build the client and the server
*/
gulp.task('default', [
  'server',
  'client'
]);

/*****************************************************************************
**
** GULP TASK: server
**
** Builds the server assets
*/
gulp.task('server', [
  'server-jslint'
]);

/*****************************************************************************
**
** GULP TASK: client
**
** Builds the website assets
*/
gulp.task('client', [
  'client-copyfiles',
  'client-polyfill',
  'client-stylesheet',
  'client-jsbundle'
]);

/*****************************************************************************
**
** GULP TASK: clean
**
** Clean up anything built by the build process
*/
gulp.task('clean', function (cb) {
  del([ config.dst.dir, './npm_debug.log' ], cb);
});

/*****************************************************************************
**
** GULP TASK: server-jslint
**
** Runs our preferred linter (eslint) over all the server JS files
*/
gulp.task('server-jslint', function () {
  return gulp.src([ './bin/**/*.js' ])
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/*****************************************************************************
**
** GULP TASK: client-copyfiles
**
** Copies anything that shouldn't need processing from the source to the
** destination directory.
*/
gulp.task('client-copyfiles', [ 'client-fonts', 'client-libcss' ],  function () {
  var copySpec = copyExtensions.map(function (ext) {
    return path.join(config.src.dir, '**/*' + ext);
  });

  return gulp.src(copySpec).pipe(gulp.dest(config.dst.dir));
});

gulp.task('client-polyfill', function () {
  var copySpec = [
    './node_modules/babel-core/browser-polyfill.min.js'
  ];
  var libDir = path.join(config.dst.dir, 'jslib');

  return gulp.src(copySpec).pipe(gulp.dest(libDir));
});

gulp.task('client-fonts', function () {
  var copySpec = [
    './node_modules/react-widgets/dist/fonts/*',
    './node_modules/font-awesome/fonts/*'
  ];
  var fontDir = path.join(config.dst.dir, 'fonts');

  return gulp.src(copySpec).pipe(gulp.dest(fontDir));
});

gulp.task('client-libcss', function () {
  var copySpec = [
    './node_modules/font-awesome/css/*'
  ];
  var cssDir = path.join(config.dst.dir, 'css');

  return gulp.src(copySpec).pipe(gulp.dest(cssDir));
});

/*****************************************************************************
**
** GULP TASK: client-stylesheet
**
** Takes the core less stylesheet for the web client and builds the css
** bundle file in the destination directory.
*/
gulp.task('client-stylesheet', function () {
  // Bring in the LESS plugin classes
  var PluginCleanCSS = require('less-plugin-clean-css'),
      PluginAutoprefixer = require('less-plugin-autoprefix');

  // Build the plugin objects per normal gulp-less rules
  var cleancss = new PluginCleanCSS(config.options.cleancss || {}),
      autoprefix = new PluginAutoprefixer(config.options.autoprefixer || {}),
      lessoptions = config.options.less || {},
      lessentry = path.join(config.src.dir, config.src.less);

  // Take whatever the LESS options in the package.json are and add
  // our plugins to them.
  lessoptions.plugins = [ cleancss, autoprefix ];

  // Runs the actual pipeline for generating bundle.css in the dst dir
  return gulp.src([lessentry])
    .pipe(less(lessoptions))
    .pipe(rename(config.dst.css))
    .pipe(gulp.dest(config.dst.dir));
});

/*****************************************************************************
**
** GULP TASK: client-jslint
**
** Runs our preferred linter (eslint) over all the webclient JS files
*/
gulp.task('client-jslint', function () {
  var jsSpec = jsExtensions.map(function (ext) {
    return path.join(config.src.dir, 'js/**/*' + ext);
  });

  return gulp.src(jsSpec)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

/*****************************************************************************
**
** GULP TASK: client-jsbundle
**
** Build our JavaScript bundle based on what is on the entry point using
** Browserify - React JSX and ES6 syntax supported.
*/
gulp.task('client-jsbundle', [ 'client-jslint' ], function () {
  var bundler = browserify({
    extensions: jsExtensions,
    transform: [ babelify.configure(config.options.babel) ],
    debug: true
  });

  var entry = path.join(config.src.dir, config.src.js);
  return bundler.add(entry)
    .bundle()
    .pipe(source(entry))
    .pipe(buffer())
    .pipe(rename(config.dst.js))
    .pipe(uglify(config.options.uglify))
    .pipe(gulp.dest(config.dst.dir));
});
