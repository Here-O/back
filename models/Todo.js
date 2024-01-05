const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const todoSchema = new Schema(
{
    id: {
        type : Number,
        default: 0,
    },
    context: {
        type :String,
        required: [true, "내용을 입력해주세요."],
    },
    date: {
        type : String,
    },
    loc: {
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
    user: {type : Schema.Types.ObjectId, ref: 'User'}
});


const todo = mongoose.model('todo', todoSchema)
module.exports = todo