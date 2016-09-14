var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var rm = require('gulp-rimraf');
var pngquant = require('imagemin-pngquant');
var imageResize = require('gulp-image-resize');
var parallel = require("concurrent-transform");
var os = require("os");

gulp.task('clean', function() {
    return gulp.src('./images/*').pipe(rm());
});

gulp.task('copy', ['clean'], function() {
    return gulp.src('./artwork/**/*')
        .pipe(gulp.dest('./images'));
});

gulp.task('imageresize', ['copy'], function () {
    return gulp.src('./images/**/*.{jpg,png}')
        .pipe(parallel(
            imageResize({ width : 2880 }),
            os.cpus().length
        ))
        .pipe(gulp.dest('./images'));
});

gulp.task('imagemin', ['imageresize'], function () {
    return gulp.src('./images/**/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./images'));
});

gulp.task('build', ['clean', 'copy', 'imageresize', 'imagemin']);
gulp.task('default', ['build']);


$(document).ready(function(){
    $(".button a").click(function(){
        $(".overlay").fadeToggle(200);
       $(this).toggleClass('btn-open').toggleClass('btn-close');
    });
});
$('.overlay').on('click', function(){
    $(".overlay").fadeToggle(200);   
    $(".button a").toggleClass('btn-open').toggleClass('btn-close');
    open = false;
});