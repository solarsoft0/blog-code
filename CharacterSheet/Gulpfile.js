var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    less = require("gulp-less"),
    minifyCSS = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    gutil = require("gulp-util");

gulp.task("build:jspm", function (cb) {
    gulp.src("src/config.js").pipe(gulp.dest("wwwroot"));
});

gulp.task("build:html", function () {
    return gulp.src(["src/**/*.html"])
        .pipe(gulp.dest("wwwroot"));
});

gulp.task("build:js", function () {
    return gulp.src(["src/**/*.js", "!src/config.js"])
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: "system" }))
        .pipe(uglify())
        .pipe(sourcemaps.write({ includeContent: false, sourceRoot: "/src/" }))
        .pipe(gulp.dest("wwwroot"));
});

gulp.task("build:css", function () {
    return gulp.src("src/style/style.less")
        .pipe(sourcemaps.init())
        .pipe(less({ compress: true }).on("error", gutil.log))
        .pipe(autoprefixer({
            browsers: ["> 3%", "last 2 versions"]
        }))
        .pipe(minifyCSS({ keepBreaks: false }))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("clean", function () {
    return gulp.src(["wwwroot/*", "!wwwroot/jspm_packages"], { read: false })
        .pipe(clean());
});

gulp.task("build", [
    "build:css",
    "build:jspm",
    "build:js",
    "build:html"
]);