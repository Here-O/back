const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counterModel');

const userSchema = new Schema(
{
    // userId 필드 추가
    userId: Number,

    userEmail: {
        type : String,
    },
    userName: {
        type:  String,
    },
    point: {
        type: Number,
    },
    userImage: {
        type: String,
        default: "",
    },
    providerType: {
        type: String,  // kakao, google, form
    },
    kakaoId: {
        type: Number,
        required: false
    },
    password: {
        type: String,
    },
    googleProfile : { type: Schema.Types.ObjectId, ref: 'googleSchema'},
    kakaoProfile: { type: Schema.Types.ObjectId, ref: 'kakaoSchema'}

});

userSchema.pre('save', async function(next) {
    let doc = this;
    if (this.isNew) {
        // Counter 업데이트, userId 설정
        const count = await Counter.findByIdAndUpdate({_id: 'userId'}, {$inc: {seq: 1}}, {new: true, upsert: true});
        doc.userId = count.seq;
    }
    next();
})

// db 모델 정의
const User = mongoose.model('User', userSchema);
module.exports = User;