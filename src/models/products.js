import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productsSchema = mongoose.Schema({
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
    view: {
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
    brandId: {
        type: mongoose.Types.ObjectId,
        ref: "Brand",
    }
},
    { timestamps: true, versionKey: false });
productsSchema.plugin(mongoosePaginate);
export default mongoose.model("Product", productsSchema);