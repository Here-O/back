const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Counter = require('./counterModel');  // Counter 모델 임포트

const todoSchema = new Schema(
{
    todoId: Number,
    
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

todoSchema.pre('save', async function(next) {
    let doc = this;
    if (this.isNew) {
        const count = await Counter.findByIdAndUpdate({_id: 'todoId'}, {$inc: {seq: 1}}, {new: true, upsert:true});
        doc.todoId = count.seq;
    }
    next();
})

const todo = mongoose.model('todo', todoSchema)
module.exports = todo