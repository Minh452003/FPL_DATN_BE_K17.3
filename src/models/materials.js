import mongoose from 'mongoose';

const materialSchema = mongoose.Schema({
    material_name: {
        type: String,
        required: true
    }
},
    { timestamps: true, versionKey: false });

export default mongoose.model('Material', materialSchema);