// Requirements
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var clean = require('gulp-clean');

gulp.task('clean', function () {
  return gulp.src('reports', {read: false})
    .pipe(clean());
});

// Consolidate JS TODOs
gulp.task('todo', require('gulpModules/domainedTodos'));

gulp.task('jshint', function () {
  gulp.src(['*.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'));
});

var GulpTaskAliases = {
  todo: ['todos','td'],
  jshint: ['jh']
};

var taskNames = Object.keys(GulpTaskAliases);
taskNames.forEach(function(taskName){
  var aliaser = function(alias){ gulp.task(alias, [taskName]); };
  GulpTaskAliases[taskName].forEach(aliaser);
});

gulp.task('default',['clean','jh','td']);
