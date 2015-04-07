/// <binding BeforeBuild="build" />

var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    exec = require("child_process").exec,
    less = require("gulp-less"),
    minifycss = require("gulp-minify-css"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    vulcanize = require("gulp-vulcanize");

var paths = {
    less: ["Style/login.less"],
    img: ["Style/**/*.jpg", "Style/**/*.png"]
};

gulp.task("build:jspm:restore", function (cb) {
    exec("jspm install", function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
        cb(err);
    });
});

gulp.task("build:components:copy", function () {
    return gulp.src([ "src/elements/**/*.html", "src/elements/**/*.css" ])
        .pipe(gulp.dest("temp"));
});

gulp.task("build:components:less", function () {
    return gulp.src("src/elements/**/*.less")
        .pipe(less())
        .pipe(autoprefixer("last 2 versions", "> 5%"))
        .pipe(minifycss())
        .pipe(gulp.dest("temp"));
});
gulp.task("build:components:js", function () {
    return gulp.src("src/elements/**/*.js")
        .pipe(babel())
        .pipe(gulp.dest("temp"));
});

gulp.task("build:components", [
    "build:components:copy",
    "build:components:less",
    "build:components:js"
], function () {
    return gulp.src("temp/**/*.html")
        .pipe(vulcanize({
            dest: "wwwroot/elements",
            inline: true,
            strip: true
        }))
        .pipe(gulp.dest("wwwroot/elements"));

});

gulp.task("clean:components", function () {
    return gulp.src(["temp", "wwwroot/elements"], { read: false })
        .pipe(clean());
});

gulp.task("build:site:less", function () {
    return gulp.src(paths.less)
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer("last 2 versions", "> 5%"))
        .pipe(rename({ suffix: ".min" }))
        .pipe(minifycss())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("build:site:images", function () {
    return gulp.src(paths.img)
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("clean:site", function () {
    return gulp.src(["wwwroot/style"], { read: false })
        .pipe(clean());
});

gulp.task("build", ["build:site:less", "build:site:images", "build:components"]);
gulp.task("clean", ["clean:site", "clean:components"]);