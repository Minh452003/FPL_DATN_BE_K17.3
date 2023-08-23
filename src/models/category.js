import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = mongoose.Schema({
  category_name: {
    type: String,
    minLength: 3,
    maxlength: 50,
  },
  category_image: {
    type: Object,
    require: true
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: "Product"
  },
},
  { timestamps: true, versionKey: false });

categorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", categorySchema)