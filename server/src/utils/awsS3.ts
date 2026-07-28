// import AWS from 'aws-sdk'

// // Update AWS configuration
// AWS.config.update({
//   secretAccessKey: process.env.AWS3_ACCESS_SECRET as string,
//   accessKeyId: process.env.AWS3_ACCESS_KEY as string,
//   region: process.env.REGION as string
// })

// const BUCKET = process.env.BUCKET as string
// const s3 = new AWS.S3()

// export { BUCKET, s3 }
import { S3Client } from '@aws-sdk/client-s3'

const s3 = new S3Client({
  region: process.env.REGION as string,
  credentials: {
    accessKeyId: process.env.AWS3_ACCESS_KEY as string,
    secretAccessKey: process.env.AWS3_ACCESS_SECRET as string
  }
})

const BUCKET = process.env.BUCKET as string

export { BUCKET, s3 }
