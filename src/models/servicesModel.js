import mongoose from 'mongoose';

export const servicesSchema = new mongoose.Schema({
    uuid: String,
    active: Boolean,
    stellar: Boolean,
    tittle: String,
    description: String,
    components: [String],
});