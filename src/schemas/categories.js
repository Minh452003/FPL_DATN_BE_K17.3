import joi,{object} from "joi"
export const categoriesSchema= joi.object({
    categories_name : joi.string().required().message({
        "string.empty": "Danh Mục bắt buộc nhập",
        "any.required": "Trường Danh Mục  bắt buộc nhập"
    }),
    categories_images: joi.string().required().message({
        "any.required": "Trường ảnh danh mục bắt buộc nhập"
    }),
});