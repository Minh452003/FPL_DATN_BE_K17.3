import mongoose from "mongoose";

const orderSchema = mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true
  },
  couponId: {
    type: mongoose.Types.ObjectId,
    ref: "Coupon"
  }
  ,
  products: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, required: true },
      product_name: String,
      product_price: Number,
      image: String,
      stock_quantity: Number,
    }
  ],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: mongoose.Types.ObjectId,
    ref: "Status",
    default: '64e8a93da63d2db5e8d8562a'
  },
  phone: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  notes: {
    type: String
  }
},
  { timestamps: true, versionKey: false });
export default mongoose.model("order", orderSchema);