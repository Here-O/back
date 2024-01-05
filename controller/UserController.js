const asyncHandler = require("express-async-handler");
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const User = require('../models/User');

const newUser = asyncHandler(async (req, res) => {

    console.log(req.body);
    const {userEmail, password} = req.body;

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
    })

    res.status(201).send('User registered successfully');    

});

module.exports = newUser;