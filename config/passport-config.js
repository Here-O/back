// // passport-config.js
// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;
// require('dotenv').config();

// passport.use(new KakaoStrategy({
//     clientID: process.env.KAKAO_ID, // 카카오 REST API 키
//     callbackURL: process.env.KAKAO_URL // 콜백 URL
// },
//     function(accessToken, refreshToken, profile, done) {
//         // 사용자 인증 후 처리 로직. profile에 사용자 정보가 담겨서 온다
//         console.log(profile);
//         User.findOrCreate({ userEmail: profile._json.kakao_account.email }, function (err, user) {
//             return done(err, user);
//         });
//     }
// ));

// passport.serializeUser(function(user, done) {
//     done(null, user.id);
// });

// passport.deserializeUser(function(id, done) {
//     User.findById(id, function(err, user) {
//         done(err, user);
//     });
// });
