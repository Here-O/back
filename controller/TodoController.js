const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const Todo = require('../models/Todo');
const User = require("../models/User");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'MY-SECRET-KEY';

// Todo 생성
const newTodo = asyncHandler(async (req, res) => {
    console.log("헤더로 넘어온 토큰: " + req.headers.authorization);

    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }
    console.log("헤더에서 토큰 추출: ", token);

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});

        const {context, date, latitude, longitude, routine, point } = req.body;

        if (!context|| !date) {
            return res.status(400).send("필수값이 입력되지 않았습니다. ");
        }
        // console.log("유저 아이디: " + loginUser._id)
        // console.log("유저 아이디: " + loginUser.id)

        const todo = await Todo.create({
            context,
            date,
            latitude,
            longitude,
            done: false,
            routine,
            point,
            user: loginUser.id // 로그인 유저 id
        })
        console.log(todo)

        res.status(200).json({
            Todo: todo
        });
    } catch (error) {
        console.log(error)
        return res.status(401).send("토큰이 유효하지 않습니다.");
    }

})

// Todo 완료
const finishTodo = asyncHandler(async (req, res) => {
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    const { todoId } = req.body;
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});
        const curTodo = await Todo.findOne({id : todoId});

        console.log(curTodo.context);
        curTodo.done = true;
        curTodo.save();

        loginUser.point += curTodo.point;
        console.log(loginUser);
        
        console.log(curTodo.context + "가 완료되었습니다.");
        res.status(200).json({
            Todo: curTodo
        });

    } catch (error) {
        console.log(error);
        return res.status(401).send("토큰이 유효하지 않습니다.");
    }

})


// Todo 삭제
const delTodo = asyncHandler(async (req, res) => {
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.body;
    console.log(id)
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        Todo.deleteOne({id: id});

        console.log("삭제완료");
        res.status(200).send('Todo Deleted successfully');    

    } catch (error) {
        console.log(error);
        return res.status(401).send("토큰이 유효하지 않습니다.");
    }

})

// Todo 불러오기

module.exports = {newTodo, delTodo, finishTodo};