'use strict';
 
var gulp            = require('gulp');
var del             = require('del');
var postcss         = require('gulp-postcss');
var autoprefixer    = require('autoprefixer');
var cssnano         = require('cssnano');
var sourcemaps      = require('gulp-sourcemaps');
var rename          = require('gulp-rename');
var stylelint       = require('stylelint');
var reporter        = require('postcss-reporter');
var rucksack        = require('rucksack-css');
var exec            = require('child_process').exec;
var comment         = require('postcss-comment');
var variables       = require('postcss-css-variables');
var postcssimport   = require('postcss-import');
var nested          = require('postcss-nested');
var cssnext         = require('postcss-cssnext');
var prefix          = require('postcss-class-prefix');
var lost            = require('lost');
var custommedia     = require('postcss-custom-media');
var each            = require('postcss-each');
var postcssfor      = require('postcss-for');
var atvars          = require('postcss-at-rules-variables');
var conditionals     = require('postcss-conditionals');


var stylerules = {
  "color-no-invalid-hex": true,
  "declaration-colon-space-before": "never",
  "indentation": 2,
  "number-leading-zero": "always"
};

var renameFunction = function (path) {
  path.extname = ".min.css";
  return path;
};

var sourceMapLocation = ['dest/css/*.css', '!dest/css/*.min.css'];

gulp.task('generate', function(done) {
  exec('php ./vendor/bin/pl-console --generate', function (err, stdout, stderr) {
    console.log(stdout);
    console.log(stderr);
    done();
  });
});

gulp.task('clean', function () {
  return del([
    'public/css/*'
  ]);
});

gulp.task('styles', function () {

  // order is important!
  var plugins = [

    postcssimport(),
    prefix('we-'),
    atvars(),
    each(),
    postcssfor(),
    conditionals(),
    lost(),
    variables(),
    custommedia(),
    rucksack(),
    nested(),
    autoprefixer({browsers: ['last 3 versions']}),
    //cssnext(),
    //cssnano()
  ];

  return gulp.src('source/scss/style.css')
    .pipe(postcss(plugins, { parser: comment }))
    .pipe(gulp.dest('source/css'));
});

/*
gulp.task('lint', ['styles'], function() {
  return gulp.src("public/css/*.css")
    .pipe(postcss([ stylelint({ "rules": stylerules }), 
    reporter({ clearMessages: true })
  ]));
});

gulp.task('rename', ['lint'], function () {
  return gulp.src('public/css/*.css')
    .pipe(rename(renameFunction))
    .pipe(gulp.dest("public/css/"));
});

gulp.task('minifyCSS', ['sourcemap'], function () {
  return gulp.src('public/css/*.min.css')
    .pipe(nano({ autoprefixer: false }))
    .pipe(gulp.dest("public/css/"));
});

gulp.task('sourcemap', ['rename'], function () {
  return gulp.src(sourceMapLocation)
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('public/css/maps/', {
      sourceMappingURLPrefix: 'https://www.mydomain.com/'
    }))
    .pipe(gulp.dest("public/css/"));
});
*/

//gulp.task('default', gulp.series('generate', 'clean', 'styles'));
//gulp.task('default', gulp.series('clean', 'styles'));
gulp.task('default', gulp.series('styles'));
var watcher = gulp.watch('source/scss/**/*', gulp.series('default'));

