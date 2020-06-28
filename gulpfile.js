const { src, dest, parallel, watch, series } = require('gulp');
const del = require('del');

const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const babel = require('gulp-babel');
const rollup = require('gulp-rollup');

const cleanCSS = require('gulp-clean-css');

const srcJsPath = './src/app.js';
const srcCssPath = './src/style.css';
const distJsName = 'signature-creator.js';
const distCssName = 'signature-creator.css';
const distJsPath = './dist/' + distJsName;
const distCssPath = './dist/' + distCssName;

function clean(cb) {
  return new Promise(function (resolve, reject) {
    del.sync([distJsPath, distCssPath]);
    resolve();
  });
}

function jsTask(cb) {
  return (
    src(srcJsPath)
      .pipe(
          rollup({
              format: 'umd',
              moduleName: 'signatureCreator',
              entry: srcJsPath,
          })
      )
      .pipe(
          babel({
              presets: ['es2015'],
          })
      )
      .pipe(uglify())
      .pipe(rename(distJsName))
      .pipe(dest('dist'))
  );
}

function cssTask(cb) {
  return src(srcCssPath)
    .pipe(cleanCSS())
    .pipe(rename(distCssName))
    .pipe(dest('dist'));
}

function watchTask(cb) {
  watch([srcJsPath, srcCssPath], parallel(jsTask, cssTask));
}

exports.clean = clean;
exports.build = parallel(jsTask, cssTask);
exports.default = series(parallel(jsTask, cssTask), watchTask);
