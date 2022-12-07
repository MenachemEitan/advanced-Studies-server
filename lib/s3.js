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