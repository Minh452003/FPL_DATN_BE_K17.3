import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import mongooseDelete from "mongoose-delete";
const CustomizedProductSchema = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    productId: {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        required: true
    },
    product_name: {
        type: String,
        required: true,
    },
    product_price: {
        type: Number,
        required: true
    },
    image: {
        type: Object,
        required: true
    },
    sold_quantity: {
        type: Number,
        default: 0
    },
    stock_quantity: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    color: String, // Người dùng tự nhập tên màu
    size: String,  // Người dùng tự nhập tên size
    material: String, // Người dùng tự nhập tên chất liệu
},
    { timestamps: true, versionKey: false });
CustomizedProductSchema.plugin(mongoosePaginate);
CustomizedProductSchema.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

export default mongoose.model("CustomizedProduct", CustomizedProductSchema);