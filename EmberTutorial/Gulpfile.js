var gulp = require("gulp"),
    less = require("gulp-less");

var config = {
    src: "./Client",
    dest: "./wwwroot"
};

gulp.task("default", [
    "htmlfiles",
    "stylesheets"
]);

gulp.task("htmlfiles", function () {
    return gulp.src(config.src + "/**/*.html")
        .pipe(gulp.dest(config.dest));
});

gulp.task("stylesheets", function () {
    return gulp.src(config.src + "/Style/site.less")
        .pipe(less())
        .pipe(gulp.dest(config.dest));
});
