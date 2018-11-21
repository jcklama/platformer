'use strict'

const gulp = require('gulp');                       // #1
const sass = require('gulp-sass');                  // #1    
const concat = require('gulp-concat');              // #1 
const babel = require('gulp-babel');                // #2
const autoprefixer = require('gulp-autoprefixer');  // #3
const browserSync = require('browser-sync').create()// #4
const reload = browserSync.reload;                  // #4

// gulp.tasks defines the block of code that runs named tasks
gulp.task('styles', () => {                         // #1
    return gulp.src('./dev/styles/**/*.scss')       // gulp.src takes files from folder
        .pipe(sass().on('error', sass.logError))    // then calls sass plugin on the next
        .pipe(autoprefixer('last 2 versions', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1')) // #3 autoprefixes before completion
        .pipe(concat('style.css'))                  // calls concat which compiles the code into a styles.css file
        .pipe(gulp.dest('./public/styles'))         // then places them in dest
        .pipe(reload({ stream: true }));            // #4 add reload to the styles task; ensure reload when styles is updated
});

gulp.task('scripts', () => {                         // #2
    gulp.src('./dev/scripts/main.js')                // add a task for scripts by grabbing scripts from dev folder
        .pipe(babel({                                // converts ES6 to browser-friendly code & concat files
            presets: ['env']
        }))
        .pipe(gulp.dest('./public/scripts')).
        pipe(reload({ stream: true }));              // #4 add reload to the script task; ensure reload when script is updated
});

gulp.task('browser-sync', () => {                   // #4
    browserSync.init({                              // an object is passed in to define the settings
        server: '.'                                 // defines the base directory of our application from which to serve files from
    })
});

// instead of running 'gulp styles', we can run gulp 'watch'
// watches the .scss files in the specified directory for changes and then runs the 'styles' task
gulp.task('watch', () => {
    gulp.watch('./dev/styles/**/*.scss', ['styles']);   // #1
    gulp.watch('./dev/scripts/main.js', ['scripts']);   // #2
    gulp.watch('*.html', reload);                       // #4
});

gulp.task('default', ['browser-sync', 'styles', 'scripts', 'watch']); // #5
// Without this, the task of...
// 1. watching directory changes
// 2. processing style and script files
// 3. serving files from a server
// would all have to be run separately. This allows us to run all of the above with the 'gulp' command