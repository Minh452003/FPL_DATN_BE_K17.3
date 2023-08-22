import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const categoriesSchema = new mongoose.Schema(
    {
        categories_name : {
            type : String,
            minLength : 3,
            maxlength: 50, 
        },
        products: [
            {
              type: mongoose.Types.ObjectId,
              ref: "Product",
              require: true,
            },
          ],
        categories_images:{
           type: String
        },
    },
    { timestamps: true, versionKey: false }
);
categoriesSchema.plugin(mongoosePaginate);
export default mongoose.modle("categories", categoriesSchema)