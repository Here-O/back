/*
    passport-kakao: OAuth 인증과정을 추상화해서 제공하는 라이브러리
*/
const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const User = require('../models/User');

passport.use(new KakaoStrategy({
    clientID: process.env.KAKAO_ID, // 카카오 REST API 키
    clientSecret: process.env.KAKAO_SECRET,
    callbackURL: process.env.KAKAO_URL // 콜백 URL
},
    async (accessToken, refreshToken, profile, done) => {

        console.log("==========================")
        console.log("KAKAO_ID:", process.env.KAKAO_ID);
        console.log("KAKAO_URL:", process.env.KAKAO_URL);

        console.log("유저 정보 출력");
        console.log(profile.provider); // kakao
        console.log(profile.username);  // 한채연
        console.log(profile.displayName);  // 한채연
        console.log(profile._json.properties.profile_image);
        try {
            // console.log("kakaoUser profile 정보: " + JSON.stringify(profile, null, 2));
            console.log("유저 정보 출력22");
            // console.log(profile.provider); // kakao
            // console.log(profile.username);  // 한채연
            // console.log(profile.displayName);  // 한채연
            // console.log(profile._json.properties.profile_image);

            // 새로운 사용자 생성
            // const user = await User.findOne({ kakaoId: profile.id });
            // if (!user) {
            //     const newUser = await User.create({
            //         kakaoId: profile.id, 
            //         providerType: profile.provider,  // kakao
            //         userImage: profile._json.properties.profile_image,
            //         point: 0,
            //         userName: profile.username,
            //     })
            // }
            console.log("접속 성공");
        } catch (error) {
            done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});


passport.deserializeUser((id, done) => {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

module.exports = passport;
