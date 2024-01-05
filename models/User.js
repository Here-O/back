const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema(
{
    userEmail: {
        type : String,
        required: [true, "이메일은 꼭 기입해주세요."],
    },
    password: {
        type :String,
    },
    googleProfile : { type: Schema.Types.ObjectId, ref: 'googleSchema'},
    kakaoProfile: { type: Schema.Types.ObjectId, ref: 'kakaoSchema'}

});

// db 모델 정의
const User = mongoose.model('User', userSchema);
module.exports = User;