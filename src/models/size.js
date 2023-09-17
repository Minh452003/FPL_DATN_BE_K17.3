import mongoose from 'mongoose';

const sizeSchema = new mongoose.Schema(
  {
    size_name: {
        type: String,
        required: true
    },
    size_price: {
        type: Number,
        required: true
    }
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Size', sizeSchema);