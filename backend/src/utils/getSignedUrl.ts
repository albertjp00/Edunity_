// generateSignedUrl.ts (or the file where this function is defined)
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function generateSignedUrl(key: string) {
  console.log('calling signed ', key);

  const command = new GetObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: key,
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 });

  // 👇 Add these lines here
  console.log("Generated signed URL at:", new Date().toISOString());
  console.log("URL:", signedUrl);

  return signedUrl;
}
