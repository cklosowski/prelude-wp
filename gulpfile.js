/* eslint-disable */
var theme, phpFiles, htmlFiles, cssFiles, sassFiles, jsFiles, imageFiles, concatFiles, url, gulp, del, postscss, postreporter, browserSync, $, options;

// Name your theme - this is outputted only when packaging your project.
theme = 'your-theme-name';

// Set the paths you will be working with
phpFiles = [
  './*.php',
  './**/*.php'
];
htmlFiles = [
  './*.html',
  './**/*.html'
];
cssFiles = [
  './assets/css/*.css',
  '!./assets/css/*.min.css'
];
sassFiles = ['./assets/scss/**/*.scss'];
jsFiles = ['./assets/js/theme.js'];
imageFiles = ['./assets/img/*.{jpg,png,gif,svg}'];
concatFiles = [
  './assets/js/*.js',
  '!./assets/js/theme.min.js',
  '!./assets/js/all.js'
];
url = 'wp-dev:8888'; // See https://browsersync.io/docs/options/#option-proxy

// Include gulp and other plugins
gulp = require('gulp');
del = require('del');
postscss = require('postcss-scss');
postreporter = require('postcss-reporter');
browserSync = require('browser-sync').create();
$ = require('gulp-load-plugins')({lazy: true});

options = {
  browsersync: {
      proxy: url,
      ghostMode: {
          clicks: true,
          forms: true,
          scroll: false
      },
      browser: [
          'google chrome'
      ],
      reloadOnRestart: true,
      injectChanges: true
  },
  stylelint: {
      reporters: [{
          formatter: 'string',
          console: true
      }]
  },
  sass: {
      outputStyle: 'compact',
      includePaths: [
          './node_modules/normalize-scss/sass/'
      ]
  },
  autoprefixer: {
      browsers: ['> 1%', 'last 3 versions', 'Safari > 7'],
      cascade: false
  },
  cssnano: {
      discardComments: {
          removeAll: true
      },
      autoprefixer: false,
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      calc: {
          mediaQueries: true
      },
      zindex: false
  }
};

/* -------------------------------------------------------------------------------------------------
  # Development Tasks
------------------------------------------------------------------------------------------------- */
// Launch a development server
gulp.task( 'serve', function() {
  browserSync.init(options.browsersync);
});

// Lint Sass/CSS
gulp.task('sass:lint', function() {
  return gulp
  .src(sassFiles)
  .pipe($.plumber())
  .pipe($.stylelint(options.stylelint));
});

// Compile and optimize Sass
gulp.task('sass', function() {
  return gulp
  .src(sassFiles)
  .pipe($.sourcemaps.init())
  .pipe($.plumber())
  .pipe($.sass(options.sass)
    .on('error', $.sass.logError))
    .on('error', $.notify.onError('Error compiling SASS!'))
  .pipe($.autoprefixer(options.autoprefixer))
  .pipe($.cssnano(options.cssnano))
  .pipe($.rename({
    suffix: '.min'
  }))
  .pipe($.sourcemaps.write('./assets/css/sourcemaps'))
  .pipe(gulp.dest('./assets/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Lint JavaScript via ESLint
gulp.task('js:lint', function() {
  return gulp
  .src(jsFiles)
  .pipe($.plumber())
  .pipe($.eslint())
  .pipe($.eslint.format())
  .pipe($.eslint.failAfterError());
});

/*------------------------------------------------------------------------------
  Production Tasks
------------------------------------------------------------------------------*/
// Minimize CSS
gulp.task('minify-css', ['sass'], function() {
	return gulp.src( cssFiles )
  	.pipe(rename({
      suffix: '.min'
    }))
    .pipe(nano({
      discardComments: {removeAll: true},
      autoprefixer: false,
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      calc: {mediaQueries: true},
      zindex: false
    }))
    .pipe(gulp.dest( './assets/css' ))
    .pipe(browserSync.reload({
      stream: true
    }));
});

// Concatenate & Minify JavaScript
gulp.task('scripts', ['lint'], function() {
  return gulp.src( concatFiles )
    .pipe(concat( 'all.js' ))
    .pipe(gulp.dest( './assets/js/' ))
    .pipe(rename('theme.min.js'))
    .pipe(uglify())
    .pipe(gulp.dest( './assets/js/' ));
});

// Compress Images
gulp.task('images', function() {
  return gulp.src( imageFiles )
  .pipe(plumber())
  .pipe(imagemin())
  .pipe(gulp.dest( './assets/img/' ));
});

// Package a zip for theme upload
gulp.task('package', function() {
  return gulp.src( [
    './**/*',
    '!bower_components',
    '!node_modules',
    '!bower_components/**',
    '!node_modules/**'
  ] )
		.pipe(zip( theme + '.zip' ))
		.pipe(gulp.dest( './' ));
});

// Build task to run all tasks and and package for distribution
gulp.task('build', ['sass', 'scripts', 'images', 'package']);

// Styles Task - minify-css is the only task we call, because it is dependent upon sass running first.
gulp.task('styles', ['minify-css']);

/*------------------------------------------------------------------------------
  Default Tasks
------------------------------------------------------------------------------*/
// Default Task
gulp.task('default', ['styles', 'scripts', 'serve', 'watch']);

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch( sassFiles, ['styles']);
  gulp.watch( jsFiles, ['scripts']);
  gulp.watch( phpFiles, browserSync.reload );
  gulp.watch( htmlFiles, browserSync.reload );
});
