/// <reference path="wwwroot/jspm_packages/npm/webcomponents.js@0.6.0/webcomponents-lite.min.js" />
/// <reference path="wwwroot/jspm_packages/npm/webcomponents.js@0.6.0/webcomponents-lite.min.js" />
/// <binding BeforeBuild='build' Clean='clean' />
var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
    concat = require("gulp-concat"),
    exec = require("child_process").exec,
    eslint = require("gulp-eslint"),
    gulpif = require("gulp-if"),
    imagemin = require("gulp-imagemin"),
    less = require("gulp-less"),
    merge = require("merge-stream"),
    minify = require("gulp-minify-css"),
    path = require("path"),
    pngquant = require("imagemin-pngquant"),
    sourcemaps = require("gulp-sourcemaps"),
    uglify = require("gulp-uglify"),
    vulcanize = require("gulp-vulcanize");

// Change this to false if not running in dev mode
var DEV_MODE = true;

//#region File and Directory Definitions
var paths = {
    src: {
        less: "src/style/main.less",
        js: "src/js/**/*.js",
        images: [
            "src/images/**/*.png",
            "src/images/**/*.jpg",
            "src/images/**/*.svg"
        ],
        configjs: "./config.js",
        elements: "src/elements/**",
        polymer: "./wwwroot/jspm_packages/github/Polymer/polymer@0.8.0"
    },
    tmp: "temp",
    commonhtml: [
        "font-awesome.html",
        "s-logo.html",
        "s-signin.html",
        "s-signout.html",
        "s-userprofile.html"
    ],
    commonlibs: [
        "wwwroot/jspm_packages/github/components/jquery@2.1.3/jquery.min.js",
        "wwwroot/jspm_packages/github/twbs/bootstrap@3.3.4/bootstrap.min.js",
        "wwwroot/jspm_packages/npm/webcomponents.js@0.6.0/webcomponents-lite.min.js"
    ],
    dest: {
        webroot: "wwwroot",
        style: "wwwroot/style",
        images: "wwwroot/images",
        js: "wwwroot/js",
        elements: "wwwroot/elements"
    }
};
//#endregion

//#region Task Operational Options
var options = {
    autoprefixer: {
        browsers: ["> 5%", "last 2 versions"],
        cascase: false,
        remove: true
    },
    babel: {
        modules: "system"
    },
    eslint: {
        envs: {
            browser: true,
            jquery: true,
            es6: true
        }
    },
    componenteslint: {
        envs: {
            browser: true,
            es6: true
        },
        globals: {
            Polymer: true
        }
    },
    imagemin: {
        progressive: true,
        svgoPlugins: [{ removeViewBox: false }],
        use: [pngquant()]
    },
    less: {
        paths: ["./node_modules/bootstrap-less"]
    }
};
//#endregion

gulp.task("build:t_components", function () {
    // Build Component Style sheet
    var v1 = gulp.src(path.join(paths.src.elements, "*.less"))
        .pipe(gulpif(!DEV_MODE, sourcemaps.init()))
        .pipe(less(options.less))
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulpif(!DEV_MODE, minify()))
        .pipe(gulpif(!DEV_MODE, sourcemaps.write()))
        .pipe(gulp.dest(paths.tmp));

    // Build Component ES6 to ES5
    var v2 = gulp.src(path.join(paths.src.elements, "*.js"))
        .pipe(eslint(options.componenteslint))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(gulpif(!DEV_MODE, sourcemaps.init()))
        .pipe(babel())
        .pipe(gulpif(!DEV_MODE, uglify()))
        .pipe(gulpif(!DEV_MODE, sourcemaps.write()))
        .pipe(gulp.dest(paths.tmp));

    // Copy over HTML Files
    var v3 = gulp.src(path.join(paths.src.elements, "*.html"))
        .pipe(gulp.dest(paths.tmp));

    return merge(v1, v2, v3);
});

gulp.task("build:components", [ "build:t_components" ], function() {
    // Vulcanize the element
    return gulp.src(path.join(paths.tmp, "**", "*.html"))
        .pipe(vulcanize({
            dest: paths.dest.elements,
            inline: true,
            excludes: {
                styles: [ "font-awesome" ]
            },
            strip: !DEV_MODE
        }))
        .pipe(gulp.dest(paths.dest.elements));
});

gulp.task("build:webfiles", function () {
    // Copy the config.js file into the web area
    var configjs = gulp.src(paths.src.configjs)
        .pipe(gulp.dest(paths.dest.webroot));

    // Build Style Sheets
    var style = gulp.src(paths.src.less)
        .pipe(sourcemaps.init())
        .pipe(less(options.less))
        .pipe(autoprefixer(options.autoprefixer))
        .pipe(gulpif(!DEV_MODE, minify()))
        .pipe(sourcemaps.write("."))
        .pipe(gulp.dest(paths.dest.style));

    // Build Images
    var images = gulp.src(paths.src.images)
        .pipe(imagemin(options.imagemin))
        .pipe(gulp.dest(paths.dest.images));

    // Build Javascript
    var js = gulp.src(paths.src.js)
        .pipe(eslint(options.eslint))
        .pipe(eslint.format())
        .pipe(eslint.failOnError())
        .pipe(sourcemaps.init())
        .pipe(babel(options.babel))
        .pipe(gulpif(!DEV_MODE, uglify()))
        .pipe(sourcemaps.write({ includeContent: false, sourceRoot: "src/" }))
        .pipe(gulp.dest(paths.dest.js));

    // Concatenate all the JS Library Polyfills we need
    var polyfills = gulp.src(paths.commonlibs)
        .pipe(concat("polyfills.js"))
        .pipe(gulp.dest(paths.dest.js));

    return merge(configjs, style, js, images, polyfills);
});

// build:libraries - not normally a part of the process
gulp.task("build:libraries", function () {
    // Download all the libraries
    exec("jspm install", function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
    });

    // Produce the Vulcanized version of polymer.html
    var DEST = path.join(paths.src.polymer, "dist");
    return gulp.src(path.join(paths.src.polymer, "polymer.html"))
        .pipe(vulcanize({
            dest: DEST,
            inline: true,
            strip: true
        }))
        .pipe(gulp.dest(DEST));
});

gulp.task("build", ["build:webfiles", "build:components"], function () {
    // Create the common.html vulcanized set of components
    var commonfiles = paths.commonhtml.map(function (p) { return path.join(paths.dest.elements, p); });
    // Add the Polymer library to the front of the common elements
    commonfiles.unshift(path.join(paths.src.polymer, "dist/polymer.html"));
    return gulp.src(commonfiles)
        .pipe(concat("common.html"))
        .pipe(gulp.dest(paths.dest.elements));
});

//#region CLEAN
gulp.task("clean", function () {
    return gulp.src([paths.dest.style, paths.dest.images, paths.dest.js, paths.dest.elements])
        .pipe(clean());
});
//#endregion

