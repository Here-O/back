const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const todoSchema = new Schema(
{
    context: {
        type :String,
        required: [true, "내용을 입력해주세요."],
    },
    date: {
        type : String,
    },
    latitude: {
        type : String,
    },
    longitude: {
        type : String,
    },
    done: {
        type : Boolean,
    },
    routine: {
        type : Boolean,
    },
    point: {
        type : Number,
    },
    user: {
        type : Schema.Types.ObjectId, 
        ref: 'User'
    },
    doneAt: {
        type: Date,
        default: null,
    }
});


const todo = mongoose.model('todo', todoSchema)
module.exports = todo