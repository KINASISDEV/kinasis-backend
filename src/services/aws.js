import { S3Client, GetObjectCommand, ListObjectsV2Command } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const AWS_REGION = process.env.S3_REGION || process.env.AWS_REGION || 'us-east-2';
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

export async function getImageFromS3(req, res) {
    try {
        const { prefix } = req.query;

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
}

export async function exportAllImagesS3(req, res) {
    try {
        const { prefix } = req.query;
        const cleanPrefix = String(prefix).trim().replace(/^\/+|\/+$/g, '');
        const s3Prefix = `${S3_ENVIRONMENT}/${cleanPrefix}`.replace(/\/+/g, '/');

        console.log('Listing images with prefix:', s3Prefix);
        
        const listCommand = new ListObjectsV2Command({
            Bucket: AWS_BUCKET,
            Prefix: s3Prefix
        });

        const listedObjects = await s3Client.send(listCommand);
        const allObjects = listedObjects.Contents || [];
        const imageObjects = allObjects.filter(obj => !obj.Key.endsWith('/'));
        
        console.log(`Found ${imageObjects.length} images`);

        const imageUrls = [];

        for (const obj of imageObjects) {
            try {
                const getCommand = new GetObjectCommand({
                    Bucket: AWS_BUCKET,
                    Key: obj.Key
                });

                const signedUrl = await getSignedUrl(s3Client, getCommand, { expiresIn: 7 * 24 * 60 * 60 }); // 7 días
                imageUrls.push({
                    key: obj.Key,
                    url: signedUrl,
                    size: obj.Size,
                    modifiedAt: obj.LastModified
                });
                console.log('Generated URL for:', obj.Key);
            } catch (urlError) {
                console.error('Error generating URL for', obj.Key, ':', urlError.message);
            }
        }

        return res.json({ 
            count: imageUrls.length,
            prefix: s3Prefix,
            images: imageUrls 
        });
    }
    catch (error) {
        const errorString = error?.message || String(error);
        console.error('Error exporting images from S3:', errorString);
        return res.status(500).json({ error: errorString });
    }
}
