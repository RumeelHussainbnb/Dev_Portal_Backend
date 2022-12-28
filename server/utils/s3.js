import dotenv from 'dotenv';
import aws from 'aws-sdk';
import crypto from 'crypto';
import { promisify } from 'util';
const randomBytes = promisify(crypto.randomBytes);

dotenv.config();

const region = process.env.Amazon_S3_region;
const bucketName = process.env.Amazon_S3_Bucket_Name;
const accessKeyId = process.env.Amazon_S3_Access_Key_ID;
const secretAccessKey = process.env.Amazon_S3_Secret_Access_Key;

const s3 = new aws.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4',
});

export async function generateUploadURL() {
  //Unique Name
  //* 16 random bytes
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString('hex');

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Expires: 600, // url is valid for 600  seconds
  };

  const uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
}
