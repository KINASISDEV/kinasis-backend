import { connectToDatabase } from '../services/mongo.js';
import { servicesSchema } from '../models/servicesModel.js';


export const getAllServices = async (req, res) => {
    const filter = {active: true};

    try {
        const db = await connectToDatabase();
        const Service = db.model('Service', servicesSchema);
        const services = await Service.find(filter);
        res.json(services);
    } catch (error) {
        console.error('Error fetching catalog:', error);
        res.status(500).json({ error: 'Failed to fetch catalog' });
    }
};