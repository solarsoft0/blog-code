/// <binding BeforeBuild="build" />

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    exec = require("child_process").exec,
    less = require("gulp-less"),
    minifycss = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps");

var paths = {
    less: ["Style/login.less"],
    img: ["Style/**/*.jpg", "Style/**/*.png"]
};

gulp.task("restore_jspm", function (cb) {
    exec("jspm install", function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
});

gulp.task("xBuildCSS", function () {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer("last 2 versions", "> 5%"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("xBuildIMG", function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("xCleanCSS", function () {
    return gulp.src(["wwwroot/style"], { read: false })
        .pipe(clean());
});

gulp.task("build", ["xBuildCSS", "xBuildIMG"]);
gulp.task("clean", ["xCleanCSS"]);