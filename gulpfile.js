const { src, dest, parallel, watch, series } = require('gulp');
const del = require('del');

const rollup = require('gulp-rollup');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const cleanCSS = require('gulp-clean-css');

const srcJsPath = './src/app.js';
const srcCssPath = './src/style.css';
const distJsName = 'signature-creator.min.js';
const distCssName = 'signature-creator.min.css';
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
          input: srcJsPath,
          format: 'umd',
          moduleName: 'signatureCreator',
          sourcemap: null
        })
      )
      .pipe(
        terser({
          mangle: {
            toplevel: true
          }
        })
      )
      .pipe(
        rename(distJsName)
      )
      .pipe(
        dest('dist')
      )
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
