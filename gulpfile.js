'use strict'
var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var notify = require('gulp-notify');
var plumber = require('gulp-plumber');
var browserSync = require('browser-sync');
var sassLint = require('gulp-sass-lint');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var cssdeclsort = require('css-declaration-sorter');
var mqpacker = require('css-mqpacker');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('sass', function(){
  gulp.src(['./_src/sass/**/*.scss', './_src/sass/**/*.sass'])
    .pipe(sourcemaps.init())
    .pipe(plumber())
    .pipe(sassLint({
      configFile: '.scss-lint.yml'
    }))
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError())
    .pipe(sass({outputStyle: 'expanded'}))
    .on('error', notify.onError(function(err) {
      return err.message;
    }))
    .pipe(postcss([autoprefixer({browsers: ['> 2%']})]))
    .pipe(postcss([cssdeclsort({order: 'smacss'})]))
    .pipe(postcss([mqpacker()]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./css'))
    .pipe(notify({
      title: 'Sass Build',
      message: 'Sass build complete'
     }));
});

gulp.task('watch', function(){
  watch(['./_src/sass/**/*.scss', './_src/sass/**/*.sass'], function() {
    return gulp.start(['sass']);
  });
  watch(['./css/**/*.css', './**/*.html'], function() {
    return gulp.start(['bs-reload']);
  })
})

gulp.task('browser-sync', function() {
  browserSync({
    server: {
      baseDir: "./",
      index: "index.html"
    }
  });
})

gulp.task('sass-release', function() {
  gulp.src(['./_src/sass/**/*.scss', './_src/sass/**/*.sass'])
    .pipe(plumber())
    .pipe(sass({outputStyle: 'compressed'}))
    .pipe(postcss([autoprefixer({browsers: ['> 2%']})]))
    .pipe(postcss([cssdeclsort({order: 'smacss'})]))
    .pipe(postcss([mqpacker()]))
    .pipe(gulp.dest('./css'))
})

gulp.task('bs-reload', function() {
  browserSync.reload();
})

gulp.task('default',['browser-sync', 'watch']);
gulp.task('release',['sass-release']);
