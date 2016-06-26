var gulp = require('gulp');
var mustache = require('gulp-mustache');
var _ = require('lodash');
var globby = require('globby');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var runSequence = require('run-sequence');
var less = require('gulp-less');
var concat = require('gulp-concat');
var del = require('del');

var THIRD_PARTY_SCRIPT_INFO = require('./lib-info/script-info.json');
var THIRD_PARTY_CSS_INFO = require('./lib-info/css-info.json');
var NG_SUFFIXES = [
  'service',
  'controller',
  'filter',
  'directive',
  'provider'
];

function getIndexArgs() {
  var indexArgs = {
    stripBase: _.constant(stripBase),
    thirdPartyScripts: THIRD_PARTY_SCRIPT_INFO.map(_.property('path')),
    thirdPartyCss: THIRD_PARTY_CSS_INFO.map(_.property('path')),
    appCss: 'app.css',
    appScripts: getAppScripts()
  };
  return indexArgs;
}

function stripBase(text, render) {
  text = render(text);
  if (text.indexOf('app') === 0) {
    text = text.substr('app'.length);
  }
  if (text.indexOf('/') === 0) {
    text = text.substr('/'.length);
  }
  return text;
}

function getAppScripts() {
  return globby.sync([
    '{app,app/!(third-party-libs)/**}/*.js',
    '!{app,app/!(third-party-libs)/**}/*{' + NG_SUFFIXES.join(',') + '}.js',
    '!app/main.js'
  ])
  .concat(globby.sync([
    '{app,app/!(third-party-libs)/**}/*{' + NG_SUFFIXES.join(',') + '}.js',
    '!app/main.js'
  ]));
}

gulp.task('compile-less', function () {
  return gulp.src('app/less/app.less')
    .pipe(sourcemaps.init())
    .pipe(less({
      paths: ['app/third-party-libs/', 'app/less']
    }))
    .pipe(concat('app.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/'));
});

gulp.task('compile-index', function () {
  return gulp.src('app/index.mustache')
    .pipe(mustache(getIndexArgs(), {extension: '.html'}))
    .pipe(gulp.dest('app'));
});

gulp.task('compile', function (cb) {
  runSequence(['compile-less', 'compile-index'], cb);
});

gulp.task('serve-dev', ['compile'], function() {
  browserSync({
    port: 8000,
    server: {
      baseDir: 'app'
    }
  });

  gulp.task('reload', ['compile-index'], function (cb) {
    browserSync.reload();
    cb();
  });

  gulp.watch(['app/**/*.js', 'app/**/*.html'], ['reload']);
  gulp.watch('app/**/*.less', ['compile-less']);
  gulp.watch('app/app.css', function () {
    gulp.src('app/app.css')
      .pipe(browserSync.reload({stream: true}));
  });
  gulp.watch('app/index.mustache', ['compile-index']);
});

gulp.task('clean', del.bind(null, [
    'node_modules',
    'app/third-party-libs/*',
    '!app/third-party-libs/forza'
  ], {dot: true}));

gulp.task('default', ['compile']);
