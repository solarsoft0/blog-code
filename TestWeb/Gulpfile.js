/// <binding BeforeBuild='build' Clean='clean' />
var gulp = require("gulp"),
    autoprefixer = require("gulp-autoprefixer"),
    babel = require("gulp-babel"),
    clean = require("gulp-clean"),
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

gulp.task("build:components", function () {
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

    // Vulcanize the element
    var v4 = gulp.src(path.join(paths.tmp, "**", "*.html"))
        .pipe(vulcanize({
            dest: paths.dest.elements,
            inline: true,
            strip: !DEV_MODE
        }))
        .pipe(gulp.dest(paths.dest.elements));

    return merge(v1, v2, v3, v4);
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

    return merge(configjs, style, js, images);
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

gulp.task("build", ["build:webfiles", "build:components"]);

//#region CLEAN
gulp.task("clean", function () {
    return gulp.src([paths.dest.style, paths.dest.images, paths.dest.js])
        .pipe(clean());
});
//#endregion

