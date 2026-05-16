"use strict";
// import AWS from 'aws-sdk'
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3 = exports.BUCKET = void 0;
// // Update AWS configuration
// AWS.config.update({
//   secretAccessKey: process.env.AWS3_ACCESS_SECRET as string,
//   accessKeyId: process.env.AWS3_ACCESS_KEY as string,
//   region: process.env.REGION as string
// })
// const BUCKET = process.env.BUCKET as string
// const s3 = new AWS.S3()
// export { BUCKET, s3 }
const client_s3_1 = require("@aws-sdk/client-s3");
const s3 = new client_s3_1.S3Client({
    region: process.env.REGION,
    credentials: {
        accessKeyId: process.env.AWS3_ACCESS_KEY,
        secretAccessKey: process.env.AWS3_ACCESS_SECRET
    }
});
exports.s3 = s3;
const BUCKET = process.env.BUCKET;
exports.BUCKET = BUCKET;
