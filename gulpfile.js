const { src, dest, parallel, watch, series } = require('gulp');
const del = require('del');

const rollup = require('gulp-rollup');
const noop = require('gulp-noop');
const terser = require('gulp-terser-js');
const rename = require('gulp-rename');

const cleanCSS = require('gulp-clean-css');

const srcJsPath = './src/app.js';
const srcCssPath = './src/style.css';
const distName = 'signature-creator.min';
const distPath = './dist/' + distName;

var ProdBuild = true;

ProdBuild = process.env.NODE_ENV === 'production';

console.log('\x1b[0m%s\x1b[90m%s\x1b[0m%s\x1b[0m%s\x1b[36m%s\x1b[0m%s',
  '[', new Date().toLocaleTimeString('en-US', { hour12: false }), ']',
  ' Detected ',
  (ProdBuild ? 'Production' : 'Development'),
  ' Environment');

function clean(cb) {
  return new Promise(function (resolve, reject) {
    del.sync([distPath + '.js', distPath + '.css']);
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
      .pipe(ProdBuild ?
        terser({
          mangle: {
            toplevel: true
          }
        }) :
        noop()
      )
      .pipe(
        rename(distName + '.js')
      )
      .pipe(
        dest('dist')
      )
  );
}

function cssTask(cb) {
  return src(srcCssPath)
    .pipe(ProdBuild ?
      cleanCSS() :
      noop()
    )
    .pipe(rename(distName + '.css'))
    .pipe(dest('dist'));
}

function watchTask(cb) {
  watch([srcJsPath, srcCssPath], parallel(jsTask, cssTask));
}

exports.clean = clean;
exports.build = series(clean, parallel(jsTask, cssTask));
exports.watch = series(clean, parallel(jsTask, cssTask), watchTask);
exports.default = exports.watch;