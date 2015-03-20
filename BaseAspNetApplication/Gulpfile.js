var gulp = require('gulp'),
	babel = require('gulp-babel'),
	bower = require('main-bower-files'),
	del = require('del'),
	eslint = require('gulp-eslint'),
	less = require('gulp-less'),
	path = require('path'),
	sourcemaps = require('gulp-sourcemaps');

var wwwroot = "wwwroot";

gulp.task("lint", function() {
	return gulp.src(["src/js/**/*.js"])
		.pipe(eslint({
			globals: {
				"require": true,
				"console": true,
				"$": true
			},
			envs: {
				browser: true,
				es6: true
			}
		}))
		.pipe(eslint.format())
		.pipe(eslint.failOnErrro());
});

gulp.task("build:css", function() {
	return gulp.src(["src/less/application.less"])
		.pipe(sourcemaps.init())
		.pipe(less({
			paths: [ "src/less" ]
		}))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(path.join(wwwroot, "css")));
});

gulp.task("build:js", function() {
	return gulp.src([ "src/js/**/*.js"])
		.pipe(sourcemaps.init())
		.pipe(babel({ modules: "amd" }))
		.pipe(sourcemaps.write("."))
		.pipe(gulp.dest(path.join(wwwroot, "js")));
});

gulp.task("build:lib", function () {
    return gulp.src(bower(), { base: 'bower_components' })
        .pipe(gulp.dest(path.join(wwwroot, "lib")));
});

gulp.task("build", [ "build:lib", "build:css", "build:js" ]);

gulp.task("clean", function(cb) {
	del([
		path.join(wwwroot, "lib/**"),
		path.join(wwwroot, "js/**"),
		path.join(wwwroot, "css/**")], cb);
});