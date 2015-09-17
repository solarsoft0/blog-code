/// <binding BeforeBuild='build' Clean='clean' />
var del = require("del"),
    gulp = require("gulp"),
    bower = require("main-bower-files"),
    plugins = require("gulp-load-plugins")(),
    config = require("./package.json").gulpConfig;

gulp.task("default", ["build"]);

gulp.task("clean", function (cb) {
    del([config.dest], cb);
});

gulp.task("build", ["build:lib", "build:app"]);

gulp.task("build:lib", function () {
    var polymerFilter = plugins.filter("**/polymer.html");

    return gulp.src(bower(), { base: './bower_components' })

        // Vulcanize the Polymer.html file
        .pipe(polymerFilter)
        .pipe(plugins.debug({title: "build:lib[polymer-filter]"}))
        .pipe(plugins.vulcanize())
        .pipe(polymerFilter.restore())

        // Everything else just gets copied
        .pipe(gulp.dest(config.dest + "/lib"));
});

gulp.task("build:app", function () {
    return gulp.src(config.src + "/**/*")
        .pipe(gulp.dest(config.dest));
});
