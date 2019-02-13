var gulp = require('gulp');
var sass = require('gulp-sass');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

var sourcemaps = require('gulp-sourcemaps')
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');

gulp.task('sass', function() {
    return gulp.src('styles/scss/**/*.scss')
        .pipe(sourcemaps.init())
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest('styles/'))
});

gulp.task('default', ['sass'], function() {
    gulp.watch('styles/scss/**/*.scss', ['sass']);
});

gulp.task('useref', function() {
    return gulp.src('*.html')
        .pipe(useref())
        .pipe(gulpIf('*.js', uglify()))
        .pipe(gulpIf('*.css', cssnano()))
        .pipe(gulp.dest('docs'));
});

gulp.task('images', function() {
    return gulp.src('images/**/*.+(png|jpg|gif|svg)')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('docs/images'));
});

gulp.task('clean:docs', function() {
    return del.sync('docs');
});

gulp.task('cache:clear', function(callback) {
    return cache.clearAll(callback);
});

gulp.task('build', function(callback) {
    runSequence('clean:docs', 'sass', ['useref', 'images'], callback);
})