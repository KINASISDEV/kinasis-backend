import { getImageFromS3 } from '../services/aws.js';
import { connectToDatabase } from '../services/mongo.js';
import { memberSchema } from '../models/membersModel.js';

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
    if (!prefix) {
        return res.status(400).json({ error: 'Prefix query parameter is required' });
    }
    return getImageFromS3(req, res);
};
