var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    cssMinifier = require("gulp-minify-css"),
    sourcemaps =  require("gulp-sourcemaps"),
    concat = require("gulp-concat"),
    less = require("gulp-less"),
    notify = require("gulp-notify"),
    jshint = require("gulp-jshint"),
    jsStylish = require("jshint-stylish"),
    uglify = require("gulp-uglify"),
    gulpWebpack = require("gulp-webpack"),
    webpackConfig = require("./webpack.config.js"),
    stream = require("webpack-stream");

var path ={
    HTML: 'index.html',
    ALL:['./**/*.jsx','src/**/*.js'],
    MINIFIED_OUT:'app.bundle.js',
    DEST_SRC:'src',
    DEST_BUILD:'build',
    DEST:'dist'
};

gulp.task("default", function(){

    gulp.watch("./less/**/*.less", ['css']);
    gulp.watch(path.ALL,['webpack']);
});

gulp.task("webpack",function(){
    gulp.src(path.ALL)
        .pipe(sourcemaps.init())
        .pipe(stream(webpackConfig))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.DEST_BUILD));
});

gulp.task("js", function(){

    gulp.src(
            "./javascript/**/*.js"
            )
        .pipe(jshint())
        .pipe(jshint.reporter(jsStylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/js"))
        .pipe(notify({message: 'js built'}));
});

gulp.task("css", function(){

    gulp.src("./less/**/*.less")
        .pipe(less())
        .pipe(csslint(
            {
                'ids': false
            }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("style.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/css"))
        .pipe(notify({
            message: "css built"
        }));

});