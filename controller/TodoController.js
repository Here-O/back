const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const Todo = require('../models/Todo');
const User = require("../models/User");
const jwt = require('jsonwebtoken');

function isNull(data) {
    return (data ===undefined || data === null) ? true: false;
}

// Todo 생성, 수정(완료)
const newTodo = asyncHandler(async (req, res) => {
    console.log("헤더로 넘어온 토큰: " + req.headers.authorization);

    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});

        const {context, date, latitude, longitude, routine, point, done } = req.body;
        console.log("현재 로그인 유저: " + loginUser.userEmail);

        // null이면 생성
        if (isNull(req.body.id)) {
            // console.log(context);
            // console.log(date);
            if (!context|| !date) {
                return res.status(400).send("필수값이 입력되지 않았습니다. ");
            }
            const todo = await Todo.create({
                context,
                date,
                latitude,
                longitude,
                done: false,
                routine,
                point,
                user: loginUser.id // 로그인 유저 id
            });
            console.log(todo);

            res.status(200).json({
                Todo: todo
            });
        } else{  // 수정요청
            const {id} = req.body;
            console.log("id입력 있음: " + id)
            const updateTodo = await Todo.findOne({_id: id});
            console.log("updateTodo : " + updateTodo)
            updateTodo.context = context;
            updateTodo.date = date;
            updateTodo.latitude = latitude;
            updateTodo.longitude = longitude;
            updateTodo.routine = routine;
            updateTodo.done = done;
            
            if (done) {  // 완료한거면
                updateTodo.doneAt = new Date();
                loginUser.point += updateTodo.point;  // 포인트 업데이트
                loginUser.save();
            }
            updateTodo.save();
            res.status(200).json({
                Todo: updateTodo
            });
        }

    } catch (error) {
        console.log(error);
        return res.status(401).send("토큰이 유효하지 않습니다.");
    }

})

// Todo 완료
const finishTodo = asyncHandler(async (req, res) => {
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.body;
    console.log("완료하려는 todo id: " + id);
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});
        const curTodo = await Todo.findOne({_id : id});

        if (curTodo.done) {
            return res.status(200).send("이미 완료된 Todo 입니다.");
        }
        // console.log(curTodo);
        curTodo.done = true;
        curTodo.doneAt = new Date();
        curTodo.save();

        loginUser.point += curTodo.point;
        loginUser.save();
        // console.log(loginUser);
        
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
    console.log(id)  // 삭제하려는 Todo의 id
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await User.findOne({userEmail: decoded.userEmail});  // 로그인한 유저
    console.log("로그인 유저 id: " + loginUser._id);

    // const curTodo = await Todo.findById({ObjectId: id})
    // console.log("삭제하려는 Todo id, curTodo._id: " + curTodo._id)
    // const madeUser = await User.findOne({id : curTodo.user});


    // console.log("curTodo._id: " + curTodo._id)
    // console.log("curTodo.user: " + curTodo.user)
    
    // 현재 로그인사용자 이메일 != todo 생성자 이메일 => 이 로직 필요해보임
    // if (loginUser.userEmail == ) {
    //     return res.status(403).send("삭제 권한이 없습니다.");
    // }

    try {
        // Todo.deleteOne({id: id});
        await Todo.findByIdAndDelete(id);


        console.log("삭제완료");
        res.status(200).send('Todo Deleted successfully');    

    } catch (error) {
        console.log(error);
        return res.status(401).send("토큰이 유효하지 않습니다.");
    }

})

// Todo 불러오기
const getTodo = asyncHandler(async (req, res) => {
    
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }
    console.log("헤더에서 토큰 추출: ", token);


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});
        console.log("현재 접속한 유저: " + loginUser);  // 여기까지 OK
        // const TodoList = await Todo.findAll({
        //     include: {
        //         model: User,
        //         where : {user: loginUser._id},
        //     }
        // })

        const todoList = await Todo.find({user: loginUser._id});
        console.log("모든 리스트 조회: " + todoList);

        res.status(200).json({
            Todo: todoList
        })
    } catch(error) {
        return res.status(401).send("토큰이 유효하지 않습니다.");
    } 

})

module.exports = {newTodo, finishTodo, delTodo, getTodo};