import { connectToDatabase } from '../services/mongo.js';
import { catalogSchema } from '../models/catalogModel.js';

export const getCatalog = async (req, res) => {
    const { name } = req.query;
    const filter = {name: name};

    try {
        const db = await connectToDatabase();
        const catalog = db.model('Catalog', catalogSchema);
        const catalogs = await catalog.find();
        const data = catalogs[0].data ? catalogs[0].data : [];
        res.json(data);
    } catch (error) {
        console.error('Error fetching catalog:', error);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
};