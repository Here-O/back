var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


// const passport = require('passport');
// require('./config/passport-config');

// Passport 초기화
// app.use(passport.initialize());
// app.use(passport.session()); // 세션 사용 시 필요



var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
// app.use('/users', usersRouter);


/*
  여기 확인하기
*/

// const cors = require('cors');
// app.use(cors({
//   origin: '*',
// }));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


// app.js
// var passport = require('./controller/passport-config'); // Passport 설정 파일


// 카카오 로그인 라우트
// app.get('/auth/kakao', passport.authenticate('kakao'));

// // 카카오 로그인 콜백 라우트
// app.get('/auth/kakao/callback', 
//   passport.authenticate('kakao', { failureRedirect: '/login' }),
//   function(req, res) {
//     // 성공적인 인증 후 리디렉션 또는 응답
//     res.redirect('/');
//   }
// );

module.exports = app;
