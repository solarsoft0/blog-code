var gulp = require("gulp"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    eslint = require("gulp-eslint"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify");


gulp.task("javascript:jspm", function () {
    return gulp.src("./config.js").pipe(gulp.dest("wwwroot"));
});

gulp.task("javascript:eslint", function () {
    return gulp.src("src/js/**/*.js")
        .pipe(eslint({
            envs: {
                browser: true,
                es6: true
            },
            globals: {
                jQuery: true
            }
        }))
        .pipe(eslint.format())
        .pipe(eslint.failOnError());
});

gulp.task("build:javascript", [ "javascript:jspm", "javascript:eslint" ], function () {
    return gulp.src("src/js/**/*.js")
        .pipe(sourcemaps.init())
        .pipe(babel({ modules: "system" }))
        .pipe(uglify())
        .pipe(sourcemaps.write({ includeContent: false, sourceRoot: "/src/" }))
        .pipe(gulp.dest("wwwroot/js"));
});

gulp.task("clean:javascript", function () {
    return gulp.src(["wwwroot/config.js", "wwwroot/js"], { read: false })
        .pipe(clean());
});