/// <binding BeforeBuild="build" />
/// <binding BeforeBuild="build" />

var gulp = require("gulp"),
    requireDir = require("require-dir");

requireDir("./Gulp", { recurse: true });

gulp.task("build", [
    "build:components",
    "build:style",
    "build:images",
    "build:javascript",
    "build:libraries"
]);
gulp.task("clean", [
    "clean:components",
    "clean:style",
    "clean:images",
    "clean:javascript",
    "clean:libraries"
]);
