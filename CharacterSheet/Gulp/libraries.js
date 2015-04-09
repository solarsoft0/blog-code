var gulp = require("gulp"),
    clean = require("gulp-clean"),
    exec = require("child_process").exec,
    path = require("path"),
    vulcanize = require("gulp-vulcanize");

gulp.task("libraries:jspm", function () {
    exec("jspm install", function (err, stdout, stderr) {
        console.log(stdout);
        console.error(stderr);
    });
});

gulp.task("libraries:polymer", ["libraries:jspm"], function () {
    var SRC_DIR = "./wwwroot/jspm_packages/github/Polymer/polymer@0.8.0",
        DEST_DIR = path.join(SRC_DIR, "dist");

    return gulp.src(path.join(SRC_DIR, "polymer.html"))
        .pipe(vulcanize({
            dest: DEST_DIR,
            inline: true,
            strip: true
        }))
        .pipe(gulp.dest(DEST_DIR));
});

gulp.task("build:libraries", ["libraries:jspm", "libraries:polymer"]);

gulp.task("clean:libraries", function () {
    return gulp.src("wwwroot/jspm_packages", { read: false })
        .pipe(clean());
});