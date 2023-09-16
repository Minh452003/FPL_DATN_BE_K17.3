import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    colors_name: {
        type: String,
        required: true
    },
    colors_price: {
        type: Number,
        required: true
      },
    colors_image: {
        type: Object,
        required: true
    },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model('Color', colorSchema);
