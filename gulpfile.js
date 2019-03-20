var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var rm = require('gulp-rimraf');
var pngquant = require('imagemin-pngquant');
var imageResize = require('gulp-image-resize');
var parallel = require("concurrent-transform");
var htmlImg64 = require('gulp-html-img64');
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

gulp.task('protect-imageresize', function () {
    return gulp.src('./private/**/*.{jpg,png}')
        .pipe(parallel(
            imageResize({ width : 1440 }),
            os.cpus().length
        ))
        .pipe(gulp.dest('./private'));
});

gulp.task('protect-imagemin', ['protect-imageresize'], function () {
    return gulp.src('./private/**/*.{jpg,png}')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('./private'));
});

gulp.task('protect', function () {
    return gulp.src('./private/**/*.html')
        .pipe(htmlImg64({
            imagesDir: '/private'
        }))
        .pipe(gulp.dest('./protected'));
});

gulp.task('build', ['clean', 'copy', 'imageresize', 'imagemin']);
gulp.task('default', ['build']);
