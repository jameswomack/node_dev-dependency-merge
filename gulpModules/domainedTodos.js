// Requirements
var path = require('path');
var gulp = require('gulp');
var todo = require('gulp-todo');
var fs   = require('fs');

// Environment
var CWD = process.cwd();
var Paths = ['reports'].reduce(function(context, name){
  context[name] = path.join(CWD, name);
  return context;
}, {});


// Consolidate JS TODOs
module.exports = function() {
  var jsSourcesMatcher = '*.js';
  var previousTokenError = null;
  var createdToDo = false;
  var domain = require('domain').create();


  function createToDoList(){
    gulp.src(jsSourcesMatcher)
      .pipe(todo())
      .pipe(gulp.dest(Paths.reports))
      .on('end', function(){
        fs.readFile(path.join(Paths.reports, 'todo.md'), function(error, contents){
          if(error){
            if(error.code === 'ENOENT'){
              console.info('No TODOs found.');
            }else{
              console.error(error);
            }
          } else {
            console.info('\n' + contents.toString());
          }
        });
      });
  }


  domain.run(function(){

    var Glob = require('glob').Glob;
    var jsGlob = new Glob(jsSourcesMatcher);

    // Only attempt to create ToDo if files
    // matching the pattern are found
    jsGlob.on('match', function(){
      jsGlob.abort();
      !createdToDo && createToDoList();
      createdToDo = true;
    });

    jsGlob.on('error', function(error){
      console.error('todo error: ', error);
    });

    jsGlob.on('end', function(matches){
      !matches.length && console.error('gulp-todo found no JS files.');
    });

  });


  domain.on('error', function(error){
    if(error !== previousTokenError && !!~error.indexOf('Unexpected token ILLEGAL')){
      console.error('gulp-todo passed invalid glob');
    }
    previousTokenError = error;
  });

};
