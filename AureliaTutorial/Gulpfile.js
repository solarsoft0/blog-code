/// <binding BeforeBuild='_build' />
var gulp = require("gulp"),
    babel = require("gulp-babel"),
    sourcemaps = require("gulp-sourcemaps");

gulp.task('build:js', function () {
    return gulp.src("src/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: "system" }))
        .pipe(sourcemaps.write({ includeContent: false, sourceRoot: "/src/" }))
        .pipe(gulp.dest("wwwroot/"));
});

gulp.task('build:html', function () {
    return gulp.src("src/**/*.html")
        .pipe(gulp.dest("wwwroot/"));
});

gulp.task("_build", ["build:js", "build:html"]);

