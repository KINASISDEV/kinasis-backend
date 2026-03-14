
import { randomUUID } from 'node:crypto';
import mongoose from 'mongoose';
import { connectToDatabase } from '../services/mongo.js';

const generateMemberUUID = () => {
    const hex = randomUUID().replace(/-/g, '').toUpperCase();
    return `MEMBER-${hex.slice(0, 6)}-${hex.slice(6, 12)}-${hex.slice(12, 18)}-${hex.slice(18, 24)}`;
};

export const memberSchema = new mongoose.Schema({
    uuid: String,
    nombre: String,
    foto: String,
    roles: [String],
    portafolio: String,
    linkedin: String,
    github: String,
    cv: String,
    is_admin: Boolean
});
