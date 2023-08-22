import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = mongoose.Schema({
    product_name: {
        type: String,
        require: true,
    },
    product_price: {
        type: Number,
        require: true
    },
    image: {
        type: Object,
        require: true
    },
    view: {
        type: Number,
        default: 0
    },
    stock_quantity: {
        type: Number,
        require: true
    },
    description: String,
    categoryId: {
        type: mongoose.Types.ObjectId,
        ref: "Category",
    },
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
    }
},
    { timestamps: true, versionKey: false });
productsSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productsSchema);