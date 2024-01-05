const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('../models/User');

const jwt = require('jsonwebtoken');
const { token } = require("morgan");
const SECRET_KEY = 'HEREO_SECRET'

// 회원가입
const newUser = asyncHandler(async (req, res) => {

    console.log(req.body);
    const {userEmail, password, username} = req.body;

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
        username,
    })
    console.log(user)

    res.status(201).send('User registered successfully');    

});


// 로그인(토큰발급)
// id, 이메일, 이름, 토큰
const loginUser = asyncHandler(async (req, res) => {
    console.log("loginUser:", req.body);
    const {userEmail, password} = req.body;
    const SECRET_KEY = 'MY-SECRET-KEY';


    // 해당 유저 없음
    const existingUser = await User.findOne({userEmail});
    if (!existingUser) {
        res.status(400).send('Not Registered UserEmail: ${userEmail}');
    }


    // 로그인 정보 맞는지 확인
    const loginUser = await User.findOne({ userEmail: req.body.userEmail});
    console.log(loginUser);

    const match = bcrypt.compare(password, loginUser.password);
    if (match) {
        console.log('User found');
        // login completed & 토큰 발급
        const token = jwt.sign(
        {
            type: 'JWT',
            userEmail: userEmail,
        }, SECRET_KEY, {
            expiresIn: '15m', // 토큰 만료시간
            issuer: "토큰 발급자"
        });
        console.log(token)

        res.status(200).json({
            code: 200,
            message: "회원가입 완료",
            jwt: token
        });
    }

})

module.exports = {newUser, loginUser};