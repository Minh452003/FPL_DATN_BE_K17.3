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
        productId: { type: mongoose.Schema.Types.ObjectId, required: true },
        product_name: String,
        product_price: Number,
        image: String,
        stock_quantity: Number,
      },
    ],
    total: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("cart", cartSchema);
