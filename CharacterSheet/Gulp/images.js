var gulp = require("gulp"),
    clean = require("gulp-clean"),
    imagemin = require("gulp-imagemin"),
    pngquant = require("imagemin-pngquant");

var images = [
    "src/images/**/*.png",
    "src/images/**/*.jpg",
    "src/images/**/*.svg"
];

gulp.task("build:images", function () {
    return gulp.src(images)
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{ removeViewBox: false }],
            use: [pngquant()]
        }))
        .pipe(gulp.dest("wwwroot/images"));
});

gulp.task("clean:images", function () {
    return gulp.src("wwwroot/images", { read: false })
        .pipe(clean());
});