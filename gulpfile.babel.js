import fs from 'fs';

import gulp from 'gulp';
import babel from 'gulp-babel';
import sass from 'gulp-sass';
import path from 'path';
import rename from 'gulp-rename';
import browserStync from 'browser-sync';
import plumber from 'gulp-plumber';
import sourcemaps from 'gulp-sourcemaps';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
import del from 'del';
import pug from 'gulp-pug';
import data from 'gulp-data';
import gulpCopy from 'gulp-copy';
import zip from 'gulp-zip';
import imagemin from 'gulp-imagemin';
import gulpStylelint from 'gulp-stylelint';
import gulpPugLint from 'gulp-pug-linter';
import pugLintStylish from 'puglint-stylish';
import eslint from 'gulp-eslint';

import generateData from './generateData';

const paths = {
  dist: './dist',
  srcPath: './src/banner_list',
  indexPath: './src/',
  zipPath: './dist',
  staticPath: './src/static/*',
};

const server = browserStync.create();

const getFolders = () => {
  return fs.readdirSync(paths.srcPath).filter(function(file) {
    return fs.statSync(path.join(paths.srcPath, file)).isDirectory();
  });
};

const FOLDERS = getFolders();

export function dataJson(done) {
  console.log('>>>> STARTING DATA JSON TASK 📄 <<<<');
  generateData();
  done();
}

export function styles(done) {
  console.log('>>>> STARTING STYLES TASK 🖌<<<<');
  done();

  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/scss/*.scss'))
      .pipe(
          plumber(function(err) {
            console.log('>>>> STYLES TASK ERROR 💔 <<<<');
            console.log(err);
            // eslint-disable-next-line no-invalid-this
            this.emit('end');
          })
      )
      .pipe(sourcemaps.init())
      .pipe(
          sass({
            outputStyle: 'compressed',
          })
      )
      .pipe(rename('styles.css'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/css')))
      .pipe(server.stream())
  );
}
export function lintStyles(done) {
  console.log('>>>> STARTING LINT STYLES TASK 🖌<<<<');
  done();
  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/**/*.{css,scss}'))
      .pipe(gulpStylelint({
        failAfterError: false,
        fix: true,
        reporters: [
          {formatter: 'string', console: true},
        ],
      })));
}
export function scripts(done) {
  console.log('>>>> STARTING SCRIPTS TASK  <<<<');
  done();

  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(babel())
      .pipe(
          plumber(function(err) {
            console.log('>>>> SCRIPTS TASK ERROR 💔 <<<<');
            console.log(err);
            // eslint-disable-next-line no-invalid-this
            this.emit('end');
          })
      )
      .pipe(sourcemaps.init())
      .pipe(uglify())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(`${paths.dist}/${folder}/js`))
  );
}

export function scriptsDev(done) {
  console.log('>>>> STARTING SCRIPTS TASK  <<<<');
  done();

  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(babel())
      .pipe(
          plumber(function(err) {
            console.log('>>>> SCRIPTS TASK ERROR 💔 <<<<');
            console.log(err);
            // eslint-disable-next-line no-invalid-this
            this.emit('end');
          })
      )
      .pipe(sourcemaps.init())
      .pipe(concat('main.js'))
      .pipe(gulp.dest(`${paths.dist}/${folder}/js`))
  );
}
export function scriptsLint(done) {
  console.log('>>>> STARTING LINT SCRIPTS TASK  <<<<');
  done();
  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/js/*.js'))
      .pipe(eslint())
      .pipe(eslint.format())
      .pipe(eslint.failAfterError())
  );
}
export function images(done) {
  console.log('>>>> STARTING IMAGES TASK 🖼 <<<<');
  done();
  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/img/*'))
      .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({
          plugins: [
            {removeViewBox: true},
            {cleanupIDs: false},
          ],
        }),
      ]))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder, '/images')))
  );
}
export function templates(done) {
  console.log('>>>> STARTING TEMPLATES TASK 📄 <<<<');
  done();
  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.srcPath, folder, '/pug/*.pug'))
      .pipe(
          pug({
            pretty: false,
          })
      )
      .pipe(rename('index.html'))
      .pipe(gulp.dest(path.join(paths.dist, '/', folder)))
  );
}
export function lintPug(done) {
  console.log('>>>> STARTING LINT PUG TASK 🖌<<<<');
  done();
  return gulp
      .src(path.join(paths.indexPath, '/**/*.pug'))
      .pipe(gulpPugLint({
        reporter: pugLintStylish,
      }));
}
export function indexDynamic(done) {
  console.log('>>>> STARTING DINAMIC INDEX TASK 📄 <<<<');
  done();
  return gulp
      .src(path.join(paths.indexPath, 'base.pug'))
      .pipe(
          data(function(file) {
            return JSON.parse(fs.readFileSync('./src/data.json'));
          })
      )
      .pipe(
          pug({
            pretty: false,
          })
      )
      .pipe(rename('index.html'))
      .pipe(gulp.dest(paths.dist));
}
export function clean(done) {
  console.log('>>>> STARTING DEL TASK ✂️ <<<<');
  done();
  return del.sync([paths.dist]);
}
export function bannerView(done) {
  done();
  return gulp
      .src(path.join(paths.indexPath, '/banner.pug'))
      .pipe(
          pug({
            pretty: false,
          })
      )
      .pipe(rename('banner.html'))
      .pipe(gulp.dest(paths.dist));
}
export function moveStatic(done) {
  done();
  return gulp
      .src(paths.staticPath)
      .pipe(
          gulpCopy(path.join(paths.dist, '/'), {
            prefix: 1,
          })
      );
}
export function zips(done) {
  console.log('>>>> STARTING ZIPS TASK 🗜<<<<');
  done();
  return FOLDERS.map((folder) => gulp
      .src(path.join(paths.zipPath, folder, '**/*'))
      .pipe(zip(`${folder}.zip`))
      .pipe(gulp.dest(path.join(paths.zipPath, '/', 'ZIPS')))
  );
}

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: paths.dist,
    },
  });
  done();
}

const initialDev = gulp.series(clean, styles, scriptsDev, images, templates, indexDynamic, bannerView, moveStatic);
const initialBuild = gulp.series(clean, styles, scripts, images, templates, indexDynamic, bannerView, moveStatic);

const watch = () => {
  console.log('>>>> STARTING WATCH TASK 👀 <<<<');
  gulp.watch(path.join(paths.srcPath, '/**/*.scss'), gulp.series(styles, reload));
  gulp.watch(path.join(paths.srcPath, '/**/*.js'), gulp.series(scriptsDev, reload));
  gulp.watch(path.join(paths.srcPath, '/**/img/*.{png,jpeg,jpg,svg,gif}'), gulp.series(images, reload));
  gulp.watch(`${paths.srcPath}/**/pug/*.pug`, gulp.series(templates, reload));
  gulp.watch(path.join(paths.indexPath, '/**/*.pug'), gulp.series(indexDynamic, bannerView, reload));
};

gulp.task('build', gulp.series(dataJson, initialBuild, lintStyles, lintPug));

const dev = gulp.series(dataJson, initialDev, serve, watch);

export default dev;
