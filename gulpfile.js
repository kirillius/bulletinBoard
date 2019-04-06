var gulp = require('gulp');
var size = require('gulp-size');
var concat = require('gulp-concat');
var browserify = require('browserify');
var source = require('vinyl-source-stream');

var angular_dir = 'public/assets/angular/';
var build_dir = 'public/assets/build/';
var fonts_dir = 'public/assets/fonts/';

var paths = {
    vendor_styles: [
        'node_modules/bootstrap/dist/css/bootstrap.css',
        'node_modules/ui-select/dist/select.css',
        'node_modules/ng-image-gallery/dist/ng-image-gallery.css'
    ],
    app_styles: [
        'public/assets/css/style.css'
    ],
    app_styles_login: [
        'public/assets/css/login.css'
    ],

    vendor_scripts: angular_dir + 'vendor.js',
    app_scripts: [
        angular_dir + 'app/**/*.module.js',
        angular_dir + 'app/app.module.js',
        angular_dir + 'app/**/*.js'
    ],

    vendor_fonts: [
        'node_modules/bootstrap/fonts/glyphicons-halflings-regular.*'
    ],
};

//===================================================================================
// VENDOR
//===================================================================================

gulp.task('vendorJS', function() {
    return browserify(paths.vendor_scripts)
        .bundle()
        .pipe(source('vendor.js'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'vendor.js'}));
});

gulp.task('vendorCSS', function() {
    return gulp.src(paths.vendor_styles)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'vendor.css'}));
});

// Fonts
gulp.task('vendorFONTS', function() {
    return gulp.src(paths.vendor_fonts)
        .pipe(gulp.dest(fonts_dir));
});

//===================================================================================
// APPLICATION
//===================================================================================

gulp.task('appJS', function() {
    return gulp.src(paths.app_scripts)
        .pipe(concat('app.js'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'app.js'}));
});

gulp.task('appCSS', function() {
    return gulp.src(paths.app_styles)
        .pipe(concat('app.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'app.css'}));
});

gulp.task('appLoginCSS', function() {
    return gulp.src(paths.app_styles_login)
        .pipe(concat('login.css'))
        .pipe(gulp.dest(build_dir))
        .pipe(size({title: 'login.css'}));
});

//===================================================================================
// WATCH
//===================================================================================

gulp.task('watch', function() {
    gulp.watch(paths.vendor_scripts, ['vendorJS']);
    gulp.watch(paths.vendor_styles, ['vendorCSS']);
    gulp.watch(paths.vendor_styles, ['vendorFONTS']);

    gulp.watch(paths.app_scripts, ['appJS']);
    gulp.watch(paths.app_styles, ['appCSS']);
    gulp.watch(paths.app_styles_login, ['appLoginCSS']);
});

gulp.task('default', ['vendorJS', 'vendorCSS', 'vendorFONTS', 'appJS', 'appCSS', 'appLoginCSS', 'watch']);