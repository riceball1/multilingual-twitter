// Gulp.js Configuration

var gulp = require('gulp');
var htmlclean = require('gulp-htmlclean');
var concat = require('gulp-concat');
var deporder = require('gulp-deporder');
var stripdebug = require('gulp-strip-debug');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
// var postcss = require('gulp-postcss');
// var assets = require('postcss-assets');
// var autoprefixer = require('autoprefixer');
// var mqpacker = require('css-mqpacker');
// var cssnano = require('cssnano');

// development mode?
devBuild = (process.env.NODE_ENV !== 'production');

// folders
folder = {
	src: 'src/',
	build: 'public/'
};

// HTML processing
gulp.task('html', function() {
	var out = folder.build + 'views/';
	var page = gulp.src(folder.src + 'views/**/*');

	// minify production code
	if(!devBuild) {
		page = page.pipe(htmlclean());
	}

	return page.pipe(gulp.dest(out));
});

// JavaScript Processing
gulp.task('js', function() {
	var jsbuild = gulp.src(folder.src + 'js/**/*')
		.pipe(deporder())
		.pipe(concat('main.js'));

		if(!devBuild) {
			jsbuild = jsbuild
				.pipe(stripedebug())
				.pipe(uglify());
		}

		return jsbuild.pipe(gulp.dest(folder.build + 'js/'));
});

// CSS Processing
gulp.task('css', function() {
	return gulp.src(folder.src + 'scss/main.scss')
		.pipe(sass({
			outputStyle: 'nested',
			prceision: 3,
			errLogToConsole:true
		}))		.pipe(gulp.dest(folder.build + 'css/'));
});

// run all tasks
gulp.task('run', ['html', 'css', 'js']);

// watch for changes
gulp.task('watch', function() {

	// html changes
	gulp.watch(folder.src + 'views/**/*', ['html'])

	// javascript changes
	gulp.watch(folder.src + 'js/**/*', ['js']);

	// css changes
	gulp.watch(folder.src + 'scss/**/*', ['css']);
});




// default task
gulp.task('default', ['run', 'watch']);

