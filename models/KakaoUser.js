const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const kakaoSchema = new Schema(
    {
        id: {
            type : String
        },
        account_email: {
            type : String
        },
        profile_image: {
            type :String,
        }
    }
);

const KakaoUser = mongoose.model('KakaoUser', kakaoSchema)
module.exports = KakaoUser