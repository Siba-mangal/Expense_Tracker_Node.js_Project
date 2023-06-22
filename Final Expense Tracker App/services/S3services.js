require("dotenv").config();
const AWS = require("aws-sdk");
const uploadToS3 = (data, filename) => {
  // console.log(process.env.AWS_BUCKET_NAME);
  // console.log(process.env.AWS_IAM_USER_KEY);
  // console.log(process.env.AWS_IAM_USER_SECRET);

  let s3bucket = new AWS.S3({
    accessKeyId: process.env.AWS_IAM_USER_KEY,
    secretAccessKey: process.env.AWS_IAM_USER_SECRET,
  });

  var params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: filename,
    Body: data,
    ACL: "public-read",
  };
  return new Promise((resolve, reject) => {
    s3bucket.upload(params, (err, res) => {
      if (err) {
        console.log("Something went wrong", err);
        reject(err);
      } else {
        console.log("Success", res);
        resolve(res.Location);
      }
    });
  });
};

module.exports = {
  uploadToS3,
};
