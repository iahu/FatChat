// a trick of load .config as JSON ;)
require.extensions['.config'] = require.extensions['.json'];

var gulp = require('gulp');

var rmdir = require('rmdir');

var browserify = require('gulp-browserify');
var named = require('vinyl-named');
var uglify = require('gulp-uglify');
var hash = require('gulp-hash');

var less = require('gulp-less');
var sass = require('gulp-sass');
var postcss = require('gulp-postcss');
var fontNormalize = require('postcss-font-normalize');
var importCSS = require('gulp-import-css');
var cssmin = require('gulp-cssmin');

var lec = require('gulp-line-ending-corrector');

var path$ = require('path');
var exportList = require('./fekit.config').export.map(function(path) {
	return path.path || path;
});
var srcRoot = path$.join(__dirname, './src/');
var destRoot = path$.join(__dirname, './prd/');
var cssDest = path$.join(__dirname, './prd/css/');
var jsDest = path$.join(__dirname, './prd/js/');
var verDest = path$.join(__dirname, './ver/');
var webpackConfig = {
	module: {
		loaders: [
			{ test: /\.json$/, loader: "json-loader" },
			{ test: /\.coffee$/, loader: "coffee-loader" }
		]
	}
};
var pathsList = {};
exportList.forEach(function(path) {
	// path = path.path || path;
	var ext = path$.extname(path);
	if ( !pathsList[ext] ) pathsList[ext] = [];
	pathsList[ext].push( path$.join(srcRoot, path) );
});

// clean tasks
gulp.task('cleanAll', function () {
	rmdir(destRoot);
});
gulp.task('clean', function () {
	rmdir(cssDest);
	rmdir(jsDest);
	rmdir(verDest);
});

var processors = [fontNormalize];

// build tasks
gulp.task('build-css', function () {
	gulp.src( pathsList['.scss'] || [] )
		.pipe( sass() )
		.pipe(sass().on('error', sass.logError))
		.pipe(gulp.dest( cssDest ));

	gulp.src( pathsList['.less'] || [] )
		.pipe( less() )
		.pipe( postcss(processors) )
		.pipe(gulp.dest( cssDest ));


	gulp.src(pathsList['.css'] || [])
		.pipe( postcss(processors) )
		.pipe( importCSS() )
		.pipe( cssmin() )
		.pipe(gulp.dest( cssDest ));
});
gulp.task('build-js', function () {
	gulp.src(pathsList['.js'] || [])
		.pipe(named())
		.pipe(browserify())
		.pipe(uglify())

		.pipe(gulp.dest( jsDest ))

		.pipe(gulp.dest( verDest ))

		// .pipe(hash())
		// .pipe(hash.manifest('versionMap.json', false))
		// .pipe(gulp.dest( './ver/' ));
});

// line-ending-correct
gulp.task('lec', function () {
	gulp.src('./html/**/*.html')
		.pipe(lec({eolc: 'LF', verbose: true}))
		.pipe( gulp.dest('./html/') );
	gulp.src('./src/css/*.css')
		.pipe(lec({eolc: 'LF', verbose: true}))
		.pipe(gulp.dest('./src/'));
	gulp.src('./src/js/*.js')
		.pipe(lec({eolc: 'LF', verbose: true}))
		.pipe(gulp.dest('./src/'));
});


// default task
gulp.task('default', ['clean', 'build-css', 'build-js']);

// watch task
gulp.task('watch', function () {
	var watcheSASS = gulp.watch('./src/css/**/*.scss', ['build-css']);
	var watcherLESS = gulp.watch('./src/css/**/*.less', ['build-css']);
	var watcherJS = gulp.watch('./src/js/**/*.js', ['build-js']);
	watcherJS.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	watcheSASS.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
	watcherLESS.on('change', function(event) {
	  console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
	});
});
