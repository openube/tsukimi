/**
 ******************************************************************************
 **%%vim: set modelines=10:
 *
 * gulpfile.js
 * Gulpfile for task running
 *
 * @author		Jacob Hipps - jacob@ycnrg.org
 * @param 		vim: set ts=4 sw=4 noexpandtab syntax=javascript:
 *
 *****************************************************************************/

var pkgdata = require('./package');
var gulp = require('gulp');
var compass = require('gulp-compass');
var gutil = require('gulp-util');
var bower = require('gulp-bower');
var jshint = require('gulp-jshint');
var jshintBamboo = require('gulp-jshint-bamboo');
var jshintSummary = require('jshint-stylish-summary');
var NwBuilder = require('nw-builder');
var C = gutil.colors;
var spawn = require('child_process').spawnSync;
var basedir = process.cwd();

// compass task:
// compile scss files to css
gulp.task('compass', function() {
	gulp.src('sass/*.scss')
		.pipe(compass({
			config_file: 'config.rb',
			css: 'public/css',
			image: 'public/img',
			sass: 'sass'
		}));
});

gulp.task('bower', function() {
	return bower({ cmd: 'install' });
});

// buildmods task:
// build native modules using nw-gyp
var target = pkgdata.nw_version;
var tversion = pkgdata.nw_version;
var natives = pkgdata.native_mods;
var build_bin = 'nw-gyp';

gulp.task('buildmods', function() {
	for(ti in natives) {
		var tmod = natives[ti];
		var wdir = basedir + '/node_modules/' + tmod;
		var build_args = [ 'rebuild', '--target='+target, '--version='+tversion ];
		gutil.log("["+C.cyan(tmod)+"] Building native extension "+C.cyan(tmod)+" ("+C.yellow(wdir)+")");
		gutil.log("["+C.cyan(tmod)+"] "+C.white.underline(build_bin + ' ' + build_args.join(' ')));
		var sout = spawn('nw-gyp', build_args, { cwd: wdir });
		if(sout.error || sout.status) {
			gutil.log(C.red("Failed to build native extension. "+sout.error));
			gutil.log("Program output:");
			console.dir(sout);
			//throw new Error('Execution failed');
			continue;
		}
		gutil.log("["+C.cyan(tmod)+"] Native extension built successfully");
	}
});

// linting task
var jsource = [ '*.js', 'public/*.js', 'public/controllers/*.js' ];
var jreporter = 'jshint-stylish';

gulp.task('lint', function() {
	return gulp.src(jsource, { base: './' })
			.pipe(jshint('.jshintrc'))
			.pipe(jshint.reporter(jreporter))
			.pipe(jshintSummary.collect())
			.pipe(jshint.reporter('fail'))
			.on('end', jshintSummary.summarize());
});

// build Mac ICNS
gulp.task('icon_icns', function() {
	// output icns file, followed by n-number of power-of-two png icons
	var icnsArgs = [ "tsukimi.icns", "tsukimi_icon.png" ];
	var sout = spawn('png2icns', icnsArgs);
	if(sout.error || sout.status) {
		gutil.log(C.red("Failed to build Mac icns file: "+sout.error));
		gutil.log("Program output:");
		console.dir(sout);
	}
	gutil.log("Mac icns file compiled OK");
});

// build Windows ICO
gulp.task('icon_ico', function() {
	// output ico file, followed by n-number of power-of-two png icons
	var icoArgs = [ "-c", "-o", "tsukimi.ico", "tsukimi_icon.png" ];
	var sout = spawn('icotool', icoArgs);
	if(sout.error || sout.status) {
		gutil.log(C.red("Failed to build Windows ico file: "+sout.error));
		gutil.log("Program output:");
		console.dir(sout);
	}
	gutil.log("Windows ico file compiled OK");
});

// nwbuilder task
gulp.task('nwbuilder', function() {
	var nw = new NwBuilder({
		appName: "tsukimi",
		appVersion: pkgdata.version,
		version: pkgdata.nw_version,
		cacheDir: './.cache',
		buildType: 'versioned',
		flavor: 'normal',
		files: ['package.json', './node_modules', './*.js', './public/**'],
		macIcns: 'tsukimi.icns',
		winIco: 'tsukimi.ico',
		macPlist: {mac_bundle_id: 'com.ycnrg.tsukimi'},
		platforms: ['win32', 'win64', 'osx64', 'linux64']
	});

	// Log stuff you want
	nw.on('log', function (msg) {
		gutil.log('nw-builder', msg);
	});

	// Build returns a promise, return it so the task isn't called in parallel
	return nw.build().catch(function (err) {
		gutil.log('nw-builder', err);
	});
});

// default task
gulp.task('default', [ 'lint', 'bower', 'compass', 'buildmods' ]);
gulp.task('build', [ 'icon_icns', 'icon_ico', 'nwbuilder' ]);
gulp.task('buildall', [ 'lint', 'bower', 'compass', 'buildmods', 'icon_icns', 'icon_ico', 'nwbuilder' ]);
