const gulp = require('gulp');
const { task, series, watch, dest } = require('gulp');
const fs = require("fs");
const path = require("path");
const browserSync = require("browser-sync").create();
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const sourcemaps = require("gulp-sourcemaps");
const sass = require("gulp-sass");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const concat = require("gulp-concat");
const imagemin = require("gulp-imagemin");
const pug = require("gulp-pug");
const del = require("del");
const zip = require("gulp-zip");
const gulpCopy = require("gulp-copy");
const data = require("gulp-data");
const gulpSequence = require("gulp-sequence");

// Global Variable
const DIST_PATH = "dist";
const SRC_PATH = "src/banner_list";
const INDEX_PATH = "src/";
const ZIP_PATH = "dist";
const getFolders = () => {
	return fs.readdirSync(SRC_PATH).filter(function(file) {
		return fs.statSync(path.join(SRC_PATH, file)).isDirectory();
	});
};
const FOLDERS = getFolders();

const generateData = require("./generateData");

task("dataJson", function(cb) {
	cb();
	generateData();
});

task("server", function(cb) {
	browserSync.init({
		notify: false,
		port: 9000,
		reloadDelay: 1000,
		server: {
			baseDir: DIST_PATH
		}
	});
	cb();
});

task("sass", function(cb) {
	console.log(">>>> STARTING STYLES TASK 🖌  <<<<");
	cb();
	return FOLDERS.map(function(FOLDERS) {
		return gulp
			.src(path.join(SRC_PATH, FOLDERS, "/scss/*.scss"))
			.pipe(
				plumber(function(err) {
					console.log(">>>> STYLES TASK ERROR 💔  <<<<");
					console.log(err);
					this.emit("end");
				})
			)
			.pipe(sourcemaps.init())
			.pipe(
				autoprefixer({
					browsers: ["last 3 versions"]
				})
			)
			.pipe(
				sass({
					outputStyle: "compressed"
				})
			)
			.pipe(rename("styles.css"))
			.pipe(gulp.dest(DIST_PATH + "/" + FOLDERS + "/css"))
			.pipe(browserSync.stream());
	});
});

task("scripts", function(cb) {
	console.log(">>>> STARTING SCRIPTS TASK  <<<<");
	cb();
	return FOLDERS.map(function(FOLDERS) {
		return gulp
			.src(path.join(SRC_PATH, FOLDERS, "/js/*.js"))
			.pipe(
				plumber(function(err) {
					console.log("SCRIPTS TASK ERROR");
					console.log(err);
					this.emit("end");
				})
			)
			.pipe(sourcemaps.init())
			.pipe(uglify())
			.pipe(concat("main.js"))
			.pipe(gulp.dest(DIST_PATH + "/" + FOLDERS + "/js"));
	});
});

task("images", function(cb) {
	console.log(">>>> STARTING IMAGES TASK 🖼  <<<<");
	cb();
	return FOLDERS.map(function(FOLDERS) {
		return gulp
			.src(path.join(SRC_PATH, FOLDERS, "/img/*"))
			.pipe(gulp.dest(DIST_PATH + "/" + FOLDERS + "/images"));
	});
});

task("templates", function(cb) {
	console.log(">>>> STARTING TEMPLATES TASK 📄  <<<<");
	cb();
	return FOLDERS.map(function(FOLDERS) {
		return gulp
			.src(path.join(SRC_PATH, FOLDERS, "/pug/*.pug"))
			.pipe(
				pug({
					pretty: false
				})
			)
			.pipe(rename("index.html"))
			.pipe(gulp.dest(DIST_PATH + "/" + FOLDERS));
	});
});

// Delete dest folder before build
task("clean", function(cb) {
	console.log(">>>> STARTING DEL TASK ✂️  <<<<");
	cb();
	return del.sync([DIST_PATH]);
});

task("zips", function(cb) {
	console.log(">>>> STARTING ZIPS TASK 🗜  <<<<");
	cb();
	return FOLDERS.map(function(FOLDERS) {
		return gulp
			.src(path.join(ZIP_PATH, FOLDERS, "**/*"))
			.pipe(zip(FOLDERS + ".zip"))
			.pipe(gulp.dest(ZIP_PATH + "/" + "ZIPS"));
	});
});

// Generate dinamic index.html for banners
task("indexDinamic", function(cb) {
	console.log(">>>> STARTING DINAMIC INDEX TASK 📄  <<<<");
	cb();
	return gulp
		.src(path.join(INDEX_PATH, "/base.pug"))

		.pipe(
			data(function(file) {
				return JSON.parse(fs.readFileSync("./src/data.json"));
			})
		)
		.pipe(
			pug({
				pretty: false
			})
		)
		.pipe(rename("index.html"))
		.pipe(gulp.dest(DIST_PATH));
});

task("copy", function(cb) {
	cb();
	return [
		gulp.src("src/static/*")
			.pipe(
				gulpCopy(DIST_PATH + "/", {
					prefix: 1
				})
			),
		gulp.src("src/banner.html")
			.pipe(
				dest(DIST_PATH + '/')
			)
	];
});

task('build', series('dataJson', 'images', 'sass', 'scripts', 'templates', 'indexDinamic', 'copy'));

task('distribute', series('clean', 'build'));

task("watch", series("distribute", "server"), function(cb) {
	console.log(">>>> STARTING WATCH TASK 👀  <<<<");

	watch(SRC_PATH + "/**/scss/*.scss", ["sass", browserSync.reload]);
	watch(SRC_PATH + "/**/img/*.{png,jpeg,jpg,svg,gif}", [
		"images",
		browserSync.reload
	]);
	watch(SRC_PATH + "/**/pug/*.pug", ["templates", reload]);
	watch(INDEX_PATH + "*", ["indexDinamic", reload]);
	watch(SRC_PATH + "/**/js/*.js", ["scripts", browserSync.reload]);
	cb();
});

task('default', series('watch'), function(cb) { cb(); });

