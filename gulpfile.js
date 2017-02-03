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
imageFiles = ['./assets/images/*.{jpg,png,gif,svg}'];
concatFiles = [
  './assets/js/*.js',
  '!./assets/js/theme.min.js'
];
url = 'factor1.dev'; // See https://browsersync.io/docs/options/#option-proxy

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
  # Utility Tasks
------------------------------------------------------------------------------------------------- */
// Delete compiled CSS and sourcemap
gulp.task('clean:css', function() {
  del([
    './assets/css/theme.min.css',
    './assets/css/sourcemaps'
  ]);
});

// Delete compiled JS file and sourcemap
gulp.task('clean:js', function() {
  del([
    './assets/js/theme.min.js',
    './assets/js/sourcemaps'
  ]);
});

/* -------------------------------------------------------------------------------------------------
  # Development Tasks
------------------------------------------------------------------------------------------------- */
// Launch a server via BrowserSync
gulp.task('serve', function() {
  browserSync.init(options.browsersync);
});

// Lint Sass via StyleLint
gulp.task('sass:lint', function() {
  return gulp
  .src(sassFiles)
  .pipe($.plumber())
  .pipe($.stylelint(options.stylelint));
});

// Compile and optimize Sass via CSSNano
gulp.task('sass', ['clean:css'], function() {
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
  .pipe($.sourcemaps.write('/sourcemaps'))
  .pipe(gulp.dest('./assets/css'))
  .pipe(browserSync.reload({
    stream: true
  }));
});

// Alias for the Sass tasks
gulp.task('styles', ['sass']);

// Lint JavaScript via ESLint
gulp.task('js:lint', function() {
  return gulp
  .src(jsFiles)
  .pipe($.plumber())
  .pipe($.eslint())
  .pipe($.eslint.format());
});

/* -------------------------------------------------------------------------------------------------
  # Production Tasks
------------------------------------------------------------------------------------------------- */
// Concatenate & minify JavaScript
gulp.task('js', function() {
  return gulp
  .src(concatFiles)
  .pipe($.sourcemaps.init())
  .pipe($.plumber())
  .pipe($.print())
  .pipe($.concat('all.js'))
  .pipe($.uglify())
  .pipe($.rename({
    basename: 'theme',
    suffix: '.min'
  }))
  .pipe($.sourcemaps.write('/sourcemaps'))
  .pipe(gulp.dest('./assets/js/'));
});

// Alias for the JS task
gulp.task('scripts', ['js']);

// Compress images
gulp.task('images', function() {
  return gulp
  .src(imageFiles)
  .pipe($.plumber())
  .pipe($.print())
  .pipe($.imagemin())
  .pipe(gulp.dest('./assets/images/'));
});

// Create a production ready zip for upload
gulp.task('package', ['sass', 'scripts', 'images'], function() {
  return gulp.src([
    './**/*',
    '!node_modules',
    '!node_modules/**',
    '!./assets/css/sourcemaps',
    '!./assets/css/sourcemaps/**',
    '!./assets/js/sourcemaps/',
    '!./assets/js/sourcemaps/**',
    '!./assets/scss/',
    '!./assets/scss/**',
    '!./assets/js/theme.js'
  ])
  .pipe($.zip(theme + '.zip'))
  .pipe(gulp.dest('./'));
});

// Alias for the package task
gulp.task('build', ['package']);

/* -------------------------------------------------------------------------------------------------
  # Default Tasks
------------------------------------------------------------------------------------------------- */
// Default Task
gulp.task('default', ['styles', 'scripts', 'watch', 'serve']);

// Watch Files For Changes
gulp.task('watch', function() {
  gulp.watch(sassFiles, ['styles']);
  gulp.watch(jsFiles, ['scripts']);
  gulp.watch(phpFiles, browserSync.reload);
  gulp.watch(htmlFiles, browserSync.reload);
});
