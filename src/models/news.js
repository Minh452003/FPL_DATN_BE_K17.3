import mongoose from "mongoose";

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
    { timestamps: true, versionKey: false })

export default mongoose.model('New', newSchema)