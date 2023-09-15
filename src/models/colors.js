import mongoose from 'mongoose';

const colorSchema = mongoose.Schema({
    colors_name: {
        type: String,
        required: true,
    },
    colors_price: {
        type: Number,
        required: true,
    },
    colors_image: {
        type: Object,
        required: true
    },
});

export default mongoose.model('Color', colorSchema);