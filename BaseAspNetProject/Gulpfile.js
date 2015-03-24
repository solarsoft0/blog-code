/// <binding BeforeBuild='build' Clean='clean' />
var gulp = require("gulp"),
    babel = require("gulp-babel"),
    bower = require("main-bower-files"),
    del = require("del"),
    eslint = require("gulp-eslint"),
    less = require("gulp-less"),
    sourcemaps = require("gulp-sourcemaps");

//#region Lint Tasks
gulp.task("lint", function () {
    return gulp.src(["Scripts/**/*.js"])
        .pipe(eslint({
            globals: {
                "require": true,
                "console": true,
                "$": true
            },
            envs: {
                browser: true,
                es6: true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});
//#endregion

//#region Build Tasks
gulp.task("xBuildJS", function () {
    return gulp.src(["Scripts/**/*.js"])
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: "amd" }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/Scripts"));
});

gulp.task("xBuildLibraries", function () {
    return gulp.src(bower(), { base: "bower_components" })
        .pipe(gulp.dest("wwwroot/lib"));
});

gulp.task("xBuildCSS", function () {
    return gulp.src(["Style/*.less"])
        .pipe(sourcemaps.init())
        .pipe(less({ paths: ["Style"] }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/Style"));
});
//#endregion

gulp.task("build", [
    "xBuildLibraries",
    "xBuildJS",
    "xBuildCSS"
]);

gulp.task("clean", function (cb) {
    del([
        "wwwroot/Style",
        "wwwroot/Scripts",
        "wwwroot/lib"
    ], cb);
});