var express = require('express');
var router = express.Router();

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
const newUser = require("../controller/UserController");


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router
.route("/signUp")
.post(newUser);


module.exports = router;
