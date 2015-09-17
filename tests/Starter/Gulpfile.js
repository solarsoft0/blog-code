/// <binding BeforeBuild='build' Clean='clean' />
var del = require("del"),
    gulp = require("gulp"),
    plugins = require("gulp-load-plugins")(),
    config = require("./package.json").gulpConfig;

gulp.task("default", ["build"]);

gulp.task("clean", function (cb) {
    del([config.dest], cb);
});

gulp.task("build", ["build:lib", "build:app"]);

gulp.task("build:lib", function () {
    return plugins.bower().pipe(gulp.dest(config.dest + "/lib"));
});

gulp.task("build:app", function () {
    return gulp.src(config.src + "/**/*")
        .pipe(gulp.dest(config.dest));
});
