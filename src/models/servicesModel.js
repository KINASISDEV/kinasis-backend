import mongoose from 'mongoose';

export const servicesSchema = new mongoose.Schema({
    uuid: String,
    createAt: Date,
    active: Boolean,
    stellar: Boolean,
    tittle: String,
    description: String,
    components: [String],
    iconRoute: String,
});