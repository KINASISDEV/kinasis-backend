import { connectToDatabase } from '../services/mongo.js';
import { memberSchema } from '../models/membersModel.js';
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';

const AWS_REGION = process.env.S3_REGION || process.env.AWS_REGION;
const AWS_BUCKET = process.env.BUCKET_S3;
const S3_ENVIRONMENT = (process.env.S3_ENVIRONMENT || '').replace(/^\/+|\/+$/g, '');

const s3Client = new S3Client({
    region: AWS_REGION,
    followRegionRedirects: true,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
});


export const getMembers = async (req, res) => {
    const { admin } = req.query;
    const filter = admin !== undefined ? { is_admin: admin === 'true' } : {};

    try {
        const db = await connectToDatabase();
        const Member = db.model('Member', memberSchema);
        const members = await Member.find(filter);
        res.json(members);
    } catch (error) {
        console.error('Error fetching members:', error);
        res.status(500).json({ error: 'Failed to fetch members' });
    }
};

export const getImageMemberS3 = async (req, res) => {
    const { prefix } = req.query;

    try {
        const cleanPrefix = String(prefix).trim().replace(/^\/+|\/+$/g, '');
        const key = `${S3_ENVIRONMENT}/${cleanPrefix}`;
        const command = new GetObjectCommand({Bucket: AWS_BUCKET,Key: key});

        const s3Object = await s3Client.send(command);

        if (s3Object.ContentType) {res.setHeader('Content-Type', s3Object.ContentType);}
        
        if (s3Object.ContentLength !== undefined) {res.setHeader('Content-Length', String(s3Object.ContentLength));}
        
        if (s3Object.ETag) {res.setHeader('ETag', s3Object.ETag);}

        res.setHeader('Cache-Control', 'public, max-age=300');

        if (!s3Object.Body) {return res.status(404).json({ error: 'Image body was empty' });}

        if (typeof s3Object.Body.pipe === 'function') {
            s3Object.Body.on('error', (streamErr) => {
                console.error('Error streaming S3 image:', streamErr);
                if (!res.headersSent) {
                    res.status(500).end('Error streaming image');
                } else {
                    res.end();
                }
            });
            return s3Object.Body.pipe(res);
        }

        const bytes = await s3Object.Body.transformToByteArray();
        return res.send(Buffer.from(bytes));
    } catch (error) {
        const errorString = error?.message || String(error);
        console.error('Error fetching image from S3:', errorString);
        return res.status(500).send(errorString);
    }
};
