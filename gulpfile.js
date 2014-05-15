var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    coffee = require('gulp-coffee');

var paths = {
  core: [ 'src/**/*.coffee' ]
};

gulp.task('build', function() {
  gulp.src(paths.core)
    .pipe(coffee())
    .pipe(concat('backbone.flux.js'))
    .pipe(gulp.dest('dist'))
    .pipe(uglify())
    .pipe(rename('backbone.flux.min.js'))
    .pipe(gulp.dest('dist'))
});

gulp.task('watch', function() {
  gulp.watch(paths.core, ['build']);
});

gulp.task('default', ['build', 'watch']);
