// // /*
// //     passport 모듈을 사용해 구현하는 방식
// // */
// const passport = require('passport');
// const KakaoStrategy = require('passport-kakao').Strategy;
// const User = require('../models/User');

// module.exports = (app) => {
//     app.use(passport.initialize());
//     passport.use(
//         new KakaoStrategy({
//             clientID: process.env.KAKAO_ID,  // REST_API 키
//             callbackURL: process.env.KAKAO_URL,  // REDIRECT_URI
//         },
//         // accessToken, refreshToken -> 로그인 성공후 카카오가 보내준 토큰
//         async (accessToken, refreshToken, profile, done) => {
//             try{
//                 console.log("카카오 로그인 요청");
//                 const accessUser = await User.findOne({
//                     where: {snsId: profile_id}  // 여기를 userEmail로
//                 })
//                 // 이미 가입된 카카오 유저라면 
//                 if (accessUser) {
//                     done(null, accessUser);
//                 } else {
//                     // 가입되지 않은 유저라면
//                     const newUser = await User.create({
//                         userEmail: profile._json && profile._json.kakao_account_email,
//                         userName: profile.displayName,
//                         providerType: 'kakao'
//                     });
//                     done(null, newUser);  // 회원가입 후 로그인 인증 완료
//                 }
//             } catch (error) {
//                 console.error(error);
//                 done(error);
//             }
//         },
//         ),
//     );
//     passport.serializeUser((user, done) => {
//         done(null, user);
//     });
//     passport.deserializeUser((user, done) => {
//         done(null, user);
//     })

// };

// const passport = require('passport')
// const KakaoStrategy = require('passport-kakao').Strategy

// passport.use('kakao-login', new KakaoStrategy({
//     clientID: process.env.KAKAO_ID,
//     callbackURL: process.env.KAKAO_URL,
// }, async (accessToken, refreshToken, profile, done) => {
//     console.log(accessToken);
//     console.log(profile);
// }));
