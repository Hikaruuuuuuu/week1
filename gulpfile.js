/*
 * @Author: mikey.kangjie 
 * @Date: 2019-02-18 08:55:17 
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2019-02-18 09:09:31
 */



var gulp = require('gulp'),
    sass = require('gulp-sass'),
    clean = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    babel = require('gulp-babel'),
    server = require('gulp-webserver'),
    fs = require('fs'),
    path = require('path'),
    url = require('url');


// 开发环境
// 编译sass
gulp.task('sass', ()=>{
    return gulp.src('./src/sass/**/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./src/css'))
})

// 编译js
gulp.task('babel', ()=>{
    return gulp.src('./src/js/*.js')
        .pipe(babel())
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./src/js/fin'))
})

// server 
gulp.task('webserver', ()=>{
    return gulp.src('src')
        .pipe(server({
            port: 8000,
            livereload: true,  // 自动刷新
            middleware: function(req, res, next){
                var pathname = url.parse(req.url).pathname;

                if(pathname == '/favicon.ico'){
                    return res.end()
                }

                pathname = pathname == '/' ? 'index.html' : pathname;
                res.end(fs.readFileSync(path.join(__dirname, 'src', pathname)))
            }
        }))
})

// watch 
gulp.task('watch', ()=>{
    gulp.watch(['./src/sass/**/*.scss','./src/js/*.js'], gulp.series('sass','babel'))
})

// default   
gulp.task('default', gulp.series('sass','babel', 'webserver', 'watch' ))

// 线上环境
// 压缩并转移js
gulp.task('distjs', ()=>{
    return gulp.src(['./src/js/fin', './src/js/lib'])
        .pipe(uglify()) // 压缩js
        .pipe(gulp.dest('./dist/js'))
})

// 压缩css
gulp.task('distcss', ()=>{
    return gulp.src('./src/css/**/*.css')
        .pipe(clean())
        .pipe(gulp.dest('./dist/css'))
})

// build 
gulp.task('build', gulp.series('distjs', 'distcss'))