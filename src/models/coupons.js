import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
    {
        coupon_name: {
            type: String,
            required: true
        },
        coupon_code: {
            type: String,
            required: true
        },
        coupon_content: {
            type: String,
            required: true
        },
        coupon_quanlity: {
            type: Number,
            required: true
        },
        discount_amount: {
            type: Number,
            required: true
        },
        expiration_date: {
            type: Date,
            required: true
        },
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model('Coupon', couponSchema);
