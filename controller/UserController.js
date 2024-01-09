const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const User = require('../models/User');
const Todo = require('../models/Todo');

const jwt = require('jsonwebtoken');
const { token } = require("morgan");

// lib config
dotenv.config();

// 회원가입
const newUser = asyncHandler(async (req, res) => {

    console.log(req.body);
    const {userEmail, password, userName } = req.body;

    if (!userEmail || !password) {
        return res.status(400).send("필수값이 입력되지 않았습니다.");
    }

    // 이메일 중복 체크
    const existingUser = await User.findOne({userEmail});
    if (existingUser) {
        return res.status(400).send('Email already exists.');
    }

    // 비밀번호 해시 생성
    const hashedPassword = await bcrypt.hash(password, 10);


    // create가 생성, 저장까지 해줌
    const user = await User.create({
        userEmail, 
        password: hashedPassword,
        userImage: "https://hereo-bucket.s3.ap-northeast-2.amazonaws.com/free-icon-user-2549965.png",
        point: 0,
        userName,
    })
    console.log(user)

    res.status(200).json({
        User: user
    })    

});


// 로그인(토큰발급)
// id, 이메일, 이름, 토큰
const loginUser = asyncHandler(async (req, res) => {
    console.log("loginUser:", req.body);
    const {userEmail, password} = req.body;
    const secret = process.env.JWT_SECRET;

    // 해당 유저 없음
    const existingUser = await User.findOne({userEmail});
    if (!existingUser) {
        res.status(400).send('Not Registered UserEmail: ${userEmail}');
    }


    // 로그인 정보 맞는지 확인
    const loginUser = await User.findOne({ userEmail: req.body.userEmail});
    console.log(loginUser);

    const match = await bcrypt.compare(password, loginUser.password);
    if (match) {
        console.log('User found');
        // login completed & 토큰 발급
        const token = jwt.sign(
        {
            type: 'JWT',
            userEmail: userEmail,
        }, secret, {
            expiresIn: '15m', // 토큰 만료시간
            issuer: "토큰 발급자"
        });
        console.log(token)

        res.status(200).json({
            id: loginUser.id,
            email: loginUser.userEmail,
            name: loginUser.userName,
            message: "로그인 완료",
            jwt: token
        });
    } else{
        res.status(403).json({
            message: "비밀번호가 틀렸습니다.",
        });
    }
})


// 내 정보
const myPage = asyncHandler(async (req, res) => {

    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.body;
    const secret = process.env.JWT_SECRET;

    console.log(id)  // 삭제하려는 Todo의 id
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, secret);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});
        
        // 이름, 이메일, 포인트합계, (+이미지)
        const aboutUser = await User.find({userEmail: loginUser.userEmail}).select("_id userEmail userName point userImage");


        res.status(200).json({
            loginUser: aboutUser
        });

    } catch (error) {
        console.log(error);
        return res.status("토큰이 유효하지 않습니다.");
    }

})


// 포인트 적립내역 확인
const accumTodo = asyncHandler(async (req, res) => {
    const secret = process.env.JWT_SECRET;
    
    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, secret);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});

        // todo context, timestamp, point, total
        const completedTodo = await Todo.find({user: loginUser._id, done: true}).select("context point doneAt");

        console.log("완료한 Todo: " + completedTodo);

        res.status(200).json({
            TodoList: completedTodo
        });
    } catch(error) {
        console.log(error);
    }

})

// 포인트가 많은 상위유저 5명 이름, 이미지 띄워주기
const topPoints = asyncHandler(async (req, res) => {
    const secret = process.env.JWT_SECRET;

    // 헤더에서 토큰 추출(근데 여기서 토큰이 왜 필요하지?)
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try {
        const decoded = jwt.verify(token, secret);
        const loginUser = await User.findOne({userEmail : decoded.userEmail});

        const topUsers = await User.find().sort({"point": -1}).limit(5).select("_id userName point userImage");  // point값을 사용해서 내림차순 정렬, 출력갯수 제한

        // if (topUsers.some(user => user._id.toString() === loginUser._id.toString())){
        //     const topUsers = await User.find().sort({"point": -1}).limit(6).select("_id userName point userImage");
        // }


        console.log("topUsers 정보: " + topUsers);
        res.status(200).json({
            topUsers: topUsers
        });

    } catch(error) {
        console.log(error);
    }

})

// 다른 유저 포인트 적립 내역 조회
const othersPointList = asyncHandler(async (req, res) => {
    // 헤더에서 토큰 추출
    const secret = process.env.JWT_SECRET;
    const token = req.headers.authorization?.split(' ')[1];
    const { id } = req.body;
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    try{
        // 조회하려는 유저 id 받아서, todoController의 getTodo
        // const getUser = await User.find({_id: id});
        console.log("조회하려는 User: " + id);

        const completedTodoList = await Todo.find({user: id, done: true});

        console.log("completedTodoList: " + completedTodoList);

        res.status(200).json({
            completedTodoList: completedTodoList
        })
    } catch(error) {
        console.log(error);
    }
})

module.exports = {newUser, loginUser, myPage, accumTodo, topPoints, othersPointList};