var gulp         = require('gulp');
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').sass;
var autoprefixer = require('gulp-autoprefixer');
var concat       = require('gulp-concat');


gulp.task('sass', function () {
  return gulp.src(config.src)
    .pipe(sourcemaps.init())
    //.pipe(sass(config.settings))
    .pipe(sass(config.settings))
    .on('error', handleErrors)
    .pipe(sourcemaps.write())
    .pipe(autoprefixer({ browsers: ['last 2 version'] }))
    .pipe(concat('style.css'))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream:true}));
});

gulp.task('sass2', function () {
  return gulp.src('./client_src/sass/*.sass')
        .pipe(sass({errLogToConsole: true}))
        .on('error', handleErrors)
        .pipe(gulp.dest('./built/stylesheets'));
});
