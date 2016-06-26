/* jshint node:true */

'use strict';

// gulp and friends

var gulp = require('gulp');

var autoprefixer = require('gulp-autoprefixer');
var concat = require('gulp-concat');
var csso = require('gulp-csso');
var gutil = require('gulp-util');
var less = require('gulp-less');
var rename = require('gulp-rename');
var sourcemaps = require('gulp-sourcemaps');

var AUTOPREFIXER_BROWSERS = [
  'Android 2.3',
  'Android >= 4',
  'Chrome >= 20',
  'Firefox >= 24', // Firefox 24 is the latest ESR
  'Explorer >= 8',
  'iOS >= 6',
  'Opera >= 12',
  'Safari >= 6'
];

// flag used for watch in server task to not stop
// when less compilation fails

var developTaskLessWatching = false;

gulp.task('dist-css-min', ['dist-css'], distCssMinTask);

gulp.task('dist-css', distCssTask);

gulp.task('develop', developTask);

/////////////////////////////////////////////////////////////

function distCssMinTask() {
  return gulp.src('./dist/css/forza.css')
    .pipe(csso())
    .pipe(rename('forza.min.css'))
    .pipe(gulp.dest('./dist/css'));
}

function distCssTask() {
  var lessStream = less({
    paths: ['app/bower_components/']
  });
  lessStream.on('error', handleLessError.bind(null, lessStream));

  return gulp.src('./less/styles.less')
    .pipe(sourcemaps.init())
    .pipe(lessStream)
    .pipe(autoprefixer({
      browsers: AUTOPREFIXER_BROWSERS
    }))
    .pipe(concat('forza.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('./dist/css'));

  function handleLessError(stream, err) {
    gutil.log(err.toString());
    if (developTaskLessWatching) {
      gutil.log('Less compilation {0}, will keep watching for changes'
        .replace('{0}', gutil.colors.red('failed'))
      );
      gutil.beep();
      stream.emit('end');
    }
    else {
      throw err;
    }
  }
}

function developTask() {
  developTaskLessWatching = true;
  gulp.watch('less/**/*.less', ['dist-css-min']);
}
