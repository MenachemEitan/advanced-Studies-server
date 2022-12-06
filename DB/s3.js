const S3 = require('aws-sdk/clients/s3');
const { aws_bucket_region, aws_access_key, aws_secret_key, aws_bucket_name } = require('../.env');
const fs = require('fs'); 
const s3 = new S3({
    region: aws_bucket_region,
    accessKeyId: aws_access_key,
    secretAccessKey: aws_secret_key
})

const uploadFile = (file) =>{
    const fileStream = fs.createReadStream(file.path);

    const uploadParams = {
        Bucket:aws_bucket_name,
        Body :fileStream,
        Key : file.filename
    }
    return s3.upload(uploadParams).promise()
}

const getFileStream = (fileKey) =>{
    const downloadParams = {
        Key:fileKey, 
        Bucket:aws_bucket_name
    }
    return s3.getObject(downloadParams).createReadStream()
}



module.exports = {uploadFile, getFileStream}


// require("dotenv").config();
// const aws =require("aws-sdk"); 
// const S3Client = require('aws-sdk/clients/s3');
// const multer = require('multer')
// const multerS3 = require('multer-s3')

// const { aws_bucket_region, aws_access_key, aws_secret_key, aws_bucket_name } =  require('../.env');
// // console.log(aws_bucket_name);
// aws.config.update({
//   secretAccessKey: aws_secret_key,
//   accessKeyId: aws_access_key,
//   region: aws_bucket_region,
// });

// const s3 = new S3Client({
//   credentials: {
//     accessKeyId: aws_access_key,
//     secretAccessKey: aws_secret_key,
//   },
//   region: aws_bucket_region,
// });

// module.exports.upload = multer({
//   storage: multerS3({
//     s3: s3,
//     bucket: aws_bucket_name,

//     key: function (req, file, cb) {
//         console.log(1);
//       const fileName =
//         "pet-img-" + Date.now() + "." + file.originalname.split(".")[1];
//         console.log(2);
//       req.fileName = fileName;
//       cb(null, fileName);
//     },
//   }),
// });