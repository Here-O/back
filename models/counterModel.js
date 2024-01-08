// Counter 스키마 정의
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CounterSchema = new mongoose.Schema({
    _id: String,
    seq: {type: Number, default: 0}
});

const Counter = mongoose.model('Counter', CounterSchema);
module.exports = Counter;