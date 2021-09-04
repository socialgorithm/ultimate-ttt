const gulp = require('gulp');  
const gulpLoadPlugins = require('gulp-load-plugins');

const $ = gulpLoadPlugins();

gulp.task('typedoc', function() {
  return gulp
    .src(['src/**/*.ts'])
    .pipe($.typedoc({
      module: 'commonjs',
      target: 'es5',
      out: 'docs/',
      name: 'Ultimate TTT JavaScript Engine'
    }));
});

gulp.task('noJekyll', function() {
  return $.file('.nojekyll', '', { src: true })
    .pipe(gulp.dest('docs/'));
});