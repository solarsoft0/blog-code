var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    less = require("gulp-less"),
    minifycss = require("gulp-minify-css"),
    path = require("path"),
    rename = require("gulp-rename"),
    sourcemaps = require("gulp-sourcemaps"),
    vulcanize = require("gulp-vulcanize");

var component_src = "src/elements";
var component_dst = "wwwroot/elements";
var component_tmp = "temp";

var paths = {
    css: path.join(component_src, "**", "*.css"),
    html: path.join(component_src, "**", "*.html"),
    less: path.join(component_src, "**", "*.less"),
    js: path.join(component_src, "**", "*.js")
};

// Task to just copy the source file to the destination area
gulp.task("components:copySRC", function () {
    return gulp.src([paths.html, paths.css])
        .pipe(gulp.dest(component_tmp));
})

// Task to pre-process less files into CSS
gulp.task("components:less", function () {
    return gulp.src(paths.less)
        .pipe(less())
        .pipe(autoprefixer("last 2 versions", "> 5%"))
        .pipe(minifycss())
        .pipe(gulp.dest(component_tmp));
});

gulp.task("components:js", function () {
    return gulp.src(paths.js)
        .pipe(babel())
        .pipe(gulp.dest(component_tmp));
});

gulp.task("build:components", [
    "components:copySRC",
    "components:less",
    "components:js"
], function () {
    return gulp.src(path.join(component_tmp, "**", "*.html"))
        .pipe(vulcanize({
            dest: component_dst,
            inline: true,
            strip: true
        }))
        .pipe(gulp.dest(component_dst));
});

gulp.task("clean:components", function () {
    return gulp.src([component_tmp, component_dst], { read: false })
        .pipe(clean());
});

