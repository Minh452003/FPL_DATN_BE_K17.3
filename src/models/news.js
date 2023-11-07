import mongoose from "mongoose";
import MongooseDelete from "mongoose-delete";

const newSchema = mongoose.Schema({
    new_title: {
        type: String,
        require: true
    },
    new_content: {
        type: String,
        require: true
    },
    image: {
        type: String,
        required: true
    }
},
    { timestamps: true, versionKey: false });
    newSchema.plugin(MongooseDelete, { overrideMethods: 'all', deletedAt: true });

export default mongoose.model('New', newSchema)