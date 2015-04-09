var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    clean = require("gulp-clean"),
    less = require("gulp-less"),
    minify = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps");

gulp.task("build:style", function () {
    return gulp.src("src/style/*.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer({
            browsers: ["> 2%", "last 2 versions"],
            cascade: false,
            remove: true
        }))
        .pipe(minify())
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest("wwwroot/style"));
});

gulp.task("clean:style", function () {
    return gulp.src("wwwroot/style", { read: false })
        .pipe(clean());
});