import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import dotenv from "dotenv";

dotenv.config();

export const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string
) => {
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: fileName,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: "private", // 🔒 make it private
  });

  await s3.send(command);

  // Instead of returning a public URL, just return the key
  return fileName;
};
