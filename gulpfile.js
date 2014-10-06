/*globals require, console*/
'use strict';
var production = false;
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var imagemin = require('gulp-imagemin');
var browserSync = require('browser-sync');
var source = require('vinyl-source-stream');
var reactify = require('reactify');
var gutil = require('gulp-util');
var notify = require('gulp-notify');


var scriptFile = './src/js/app.js';
var scriptDist = 'dist/js';

gulp.task('default', ['server', 'watch']);
gulp.task('compile', ['minified_scripts', 'css', 'html', 'assets']);
gulp.task('server', function() {
    return browserSync.init(['./dist/**/*'], {
        server: {
            baseDir: './dist'
        }
    });
});
gulp.task('watch', ['watchScripts', 'watchHtml', 'watchCSS']);
gulp.task('watchCSS', function() {
    return gulp.watch('src/css/*.css', ['css']);
});
gulp.task('watchHtml', function() {
    return gulp.watch('src/index.html', ['html']);
});
gulp.task('minified_scripts', function() {
    return scripts(browserify, true);
});
gulp.task('scripts', function() {
    return scripts(browserify);
});
gulp.task('watchScripts', function() {
    return scripts(watchify);
});

function scripts(handler, minify) {
    var bundler = handler(scriptFile);

    bundler.transform(reactify);

    if(minify) {
        bundler.plugin('minifyify', {
            map: 'bundle.map.json',
            output: scriptDist + '/bundle.map.json'
        });
    }

    var rebundle = function() {
        var stream = bundler.bundle({
            debug: !production
        });
        stream.on('error', function(err) {
            gutil.beep();

            console.log('Browserify error : ' + err);
        }).on('error', notify.onError({
            message: 'Error: <%= error.message %>',
            title: 'Browserify error'
        }));

        return stream.pipe(source('bundle.js')).pipe(gulp.dest(scriptDist));
    };
    bundler.on('update', rebundle);
    return rebundle();
}
gulp.task('css', function() {
    return gulp.src('src/css/*.css').pipe(gulp.dest('dist/css'));
});
gulp.task('html', function() {
    return gulp.src('src/index.html').pipe(gulp.dest('dist'));
});
gulp.task('assets', function() {
    return gulp.src(['src/assets/*.png', 'src/assets/*.jpg']).pipe(imagemin()).pipe(gulp.dest('dist/assets'));
});