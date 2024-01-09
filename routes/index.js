var express = require('express');
var router = express.Router();

const jwt = require('jsonwebtoken');
const passport = require('passport');

const dotenv = require('dotenv');
dotenv.config()

// DB연결
const mongoose = require('mongoose');
mongoose
  .connect(
    'mongodb+srv://hereo1234:hereo1234@hereo.qxgibei.mongodb.net/hereo',
    {
      // useNewUrlPaser: true,
      // useUnifiedTofology: true,
      // useCreateIndex: true,
      // useFindAndModify: false,
    }
  )
  .then(() => console.log('MongoDB connected'))
  .catch((err) => {
    console.log(err);
  });

// index.js에서 User 스키마 참고하도록 require
const User = require('../models/User');
const KakaoUser = require('../models/KakaoUser')
const GoogleUser = require('../models/GoogleUser')
const Todo = require('../models/Todo')

const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
router.use(bodyParser.json()); // JSON 형식의 본문을 해석할 수 있도록 설정

const {newUser, loginUser, myPage, accumTodo, topPoints, othersPointList} = require("../controller/UserController");
const {newTodo, finishTodo, delTodo, getTodo} = require("../controller/TodoController");
const {upload} = require("../controller/ImageUploader");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router
.route("/signUp")
.post(newUser);


router
.route("/login")
.post(loginUser);


router
.route("/mypage")
.get(myPage);


router
.route("/todo")
.post(newTodo)
.patch(finishTodo)
.delete(delTodo)
.get(getTodo);

router
.route("/mypage/point")
.get(accumTodo);

router
.route("/points/top")
.get(topPoints);

router
.route("/points")
.post(othersPointList);

router
.route("/mypage/image")
.patch(upload.single('image'), async (req, res) => {
  // req.file객체에서 업로드된 정보확인

  try {
    // 토큰으로 수정권한이 있는지 확인
    if (!req.file) {
      return res.status(400).send({
        message: '이미지를 업로드 해주세요.'
      });
    }

    console.log("이미지 업로드: " + req.file);
    console.log("이미지 URL: " + req.file.location);

    // 헤더에서 토큰 추출
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(403).send("토큰이 없습니다.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const loginUser = await User.findOne({userEmail : decoded.userEmail});

    // +(현재 로그인해서 사진을 수정하려는 유저 ==  s3에 있는 사진 주인인지?)
    // multer가 s3에 업로드하고, 해당 파일의 정보를 req.file 객체에 추가함. 업로드된 파일URL 가져오기
    const fileUrl = req.file.location;

    // db 업데이트
    await User.findByIdAndUpdate(loginUser._id, {userImage: fileUrl});

    res.send({
      message: "이미지가 성공적으로 업로드되었습니다.",
      userImage: fileUrl
    });

  } catch(error) {
    console.log(error);
    res.status(500).send({
      message: '이미지 업로드 중 오류가 발생했습니다.'
    });
  }

});

// router.get('/kakao', passport.authenticate('kakao'));
// router.get('/auth/kakao/callback', 
//   passport.authenticate('kakao', { failureRedirect: '/login', }), 
//     (req, res) => {
//       res.redirect('/');
//   }
// );

module.exports = router;
