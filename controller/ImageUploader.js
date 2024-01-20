const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');
const { randomUUID } = require('crypto');


aws.config.update({
    region: 'ap-northeast-2',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new aws.S3();

// AWS S3 업로드 설정 (multer 사용, multipart/form-data 형식 파일 업로드 지원)
const storage = multerS3({
    s3,
    acl: 'public-read-write',  // 버킷 객체에 대한 권한설정
    bucket: 'hereo-bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
        // 파일 이름 생성 및 변환
        cb(null, Date.now().toString() + randomUUID() + file.originalname);
    },
});

// 파일 업로드 객체 생성
const upload = multer({
    storage,
    limits:{ fileSize: 5*1024*1024},
    defaultValue: { path: '', mimetype: ''},
});


// S3에서 삭제
const deleteImage = (fileKey) => {
    s3.deleteObject(
        {
            Bucket: 'hereo-bucket',
            Key: fileKey,
        },
        (err, data) => {
            if (err) {
                throw err;
            } else {
                console.log("Image Deleted");
            }
        }
    );
};

module.exports = {upload};
