var gulp = require("gulp"),
    csslint = require("gulp-csslint"),
    cssMinifier = require("gulp-minify-css"),
    sourcemaps = require("gulp-sourcemaps"),
    jshint = require("gulp-jshint"),
    jsStylish = require("jshint-stylish"),
    uglify = require("gulp-uglify"),
    concat = require("gulp-concat"),
    notify = require("gulp-notify");


gulp.task("default", function(){
    var cssWatcher = gulp.watch('./Frontend/less/**/*.css', ['css-build']);
    cssWatcher.on('change', function(event){
        console.log("File: " + event.path + " was " + event.typed);
    });

    var jsWatcher = gulp.watch('./Frontend/javascript/**/*.js', ['js-build']);
    jsWatcher.on('change', function(event){
        console.log("File: " + event.path + " was " + event.typed);
    });
});

gulp.task("js-build", function(){
    gulp.src("./Frontend/javascript/**/*.js")
        .pipe(jshint())
        .pipe(jshint.reporter(jsStylish))
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./Frontend/dist/js'))
        .pipe(notify({message: 'js built'}));
});


gulp.task("css-build", function(){
    gulp.src("./Frontend/less/**/*.css")
        .pipe(csslint({
            'ids': false
        }))
        .pipe(csslint.reporter("junit-xml"))
        .pipe(csslint.reporter("fail"))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./Frontend/dist/css"));
});

gulp.task("copy-externals", function(){

    gulp.src("../bower_components/modernizr.js/modernizr.js.js")
        .pipe(gulp.dest("./Frontend/dist/js"));

});