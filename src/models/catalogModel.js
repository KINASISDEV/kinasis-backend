
import mongoose from 'mongoose';

export const catalogSchema = new mongoose.Schema({
    name: String,
    data: { type: Object }
});