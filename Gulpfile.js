var gulp                = require('gulp');
var connect             = require('gulp-connect');
var inject              = require('gulp-inject');
var history             = require('connect-history-api-fallback');
var runSequence         = require('run-sequence');
var wiredep             = require('wiredep').stream;
var angularFilesort     = require('gulp-angular-filesort');

// Servidor web de desarrollo
gulp.task('server', function(){

  connect.server({
    root: './app',
    hostname: '127.0.0.1',
    port: 8000,
    livereload: true,
    middleware: function(connect, opt){
      return [ history({}) ];
    }
  });
});

//Recarga el navegador cuando hay un cambio en el código HTML
gulp.task('html', function(){
  gulp.src('./app/**/*.html').pipe(connect.reload());
});

// Recarga el navegador cuando se producen cambios en los CSS
gulp.task('css', function(){
  gulp.src('./app/css/**/*.css')
    .pipe(connect.reload());
});

//Inyecta las librerias que instalemos via bower
gulp.task('wiredep', function(){
  gulp.src('app/index.html')
    .pipe(wiredep({
      directory: 'app/lib',
      devDependencies: true
    }))
    .pipe(gulp.dest('app'));
});

//Busca en las carpetas de estilos y javascript los archivos
//para inyectarlos en el index.html
gulp.task('inject', function(){
  return gulp.src('index.html', {cwd:'app'})
    .pipe(inject(gulp.src(['app/js/**/*.js'])
                  .pipe(angularFilesort()),
                  {
                    ignorePAth: '/app',
                  }
                )
          )
    .pipe(inject(gulp.src(['app/css/**/*.css']),{
      read: false,
      ignorePath: '/app'
    }))
    .pipe(gulp.dest('app'));
});

//Vigila los cambios que se produzcan en el código y lanza las tareas relacionadas.
gulp.task('watch', function(){
  gulp.watch(['./app/**.html'], ['html']);
  gulp.watch(['./app/css/**/*.css'], ['css']);
  gulp.watch(['./app/js/**/*.js', './app/css/**/*.js'], ['inject']);
  gulp.watch(['./bower.json'], ['wiredep']);
});

gulp.task('default', function(callback){
  runSequence(
              'inject',
              'watch',
              'server',
              callback);
});
