var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var watch = require('gulp-watch');

gulp.task('watch', ['compress'] , function() {
    gulp.watch(['js/dev/*.js'], ['compress']);
});

gulp.task('compress', function() {
    return gulp.src('js/dev/*.js')
        .pipe(concat('app.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('js/dist'));
});