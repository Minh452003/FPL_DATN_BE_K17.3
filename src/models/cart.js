import mongoose from "mongoose";

const cartSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: String,
        product_name: String,
        product_price: Number,
        image: String,
        stock_quantity: Number,
      },
    ],
    total: {
      type: Number,
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("cart", cartSchema);
