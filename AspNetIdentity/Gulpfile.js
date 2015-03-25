/// <binding BeforeBuild='build' Clean='clean' />
var gulp = require("gulp"),
    babel = require("gulp-babel"),
    bower = require("main-bower-files"),
    del = require("del"),
    eslint = require("gulp-eslint"),
    less = require("gulp-less"),
    sourcemaps = require("gulp-sourcemaps");

var paths = {
    js:         ["Scripts/**/*.js"],
    less:       ["Style/*.less"],
    img:        ["Style/**/*.png","Style/**/*.jpg"],
    html:       ["Scripts/**/*.html","Scripts/**/*.css","Scripts/**/*.png"],
    htmlless:   "Scripts/**/*.less"
};

//#region Lint Tasks
/* ESLint is configured inside package.json */
gulp.task("lint", function () {
    return gulp.src(paths.js)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
//#endregion

//#region Build Tasks
/*
 *  HTML = CSS + HTML + IMG
 *      + JS = LINT
 *      + LESS
 */
gulp.task("xBuildJS", ["lint"], function () {
    return gulp.src(paths.js)
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: "amd" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/Scripts"));
});

gulp.task("xBuildElementLESS", function () {
    return gulp.src(paths.htmlless)
        .pipe(sourcemaps.init())
        .pipe(less({ paths: ["Style"] }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/Scripts"));
});

gulp.task("xBuildHTML", ["xBuildJS", "xBuildElementLESS"], function () {
    return gulp.src(paths.html)
        .pipe(gulp.dest("wwwroot/Scripts"));
});

gulp.task("xBuildIMG", function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest("wwwroot/Style"));
});

gulp.task("xBuildCSS", [ "xBuildIMG" ], function () {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less({ paths: ["Style"] }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/Style"));
});

gulp.task("xBuildNPM", function () {
    return gulp.src(["node_modules/babel-core/*.js"])
        .pipe(gulp.dest("wwwroot/lib/babel-core"));
});

gulp.task("xBuildLibraries", ["xBuildNPM"], function () {
    return gulp.src(bower(), { base: "bower_components" })
        .pipe(gulp.dest("wwwroot/lib"));
});
//#endregion

gulp.task("build", ["xBuildLibraries", "xBuildCSS", "xBuildHTML", "xBuildJS"]);

gulp.task("clean", function (cb) {
    del([
        "wwwroot/Style",
        "wwwroot/Scripts",
        "wwwroot/lib"
    ], cb);
});

