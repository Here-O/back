const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const Todo = require('../models/Todo');



// Todo 생성
// const newTodo = asyncHandler(async (req, res) => {
//     console.log("Todo Create Req : " + req.body);

//     const {context, date, loc, done, routine, point } = req.body;

//     if (!context|| !date) {
//         return res.status(400).send("필수값이 입력되지 않았습니다. ");
//     }

//     const todo = await Todo.create({
//         id:
//     })

//     // 

// })

// Todo 삭제


// Todo 완료