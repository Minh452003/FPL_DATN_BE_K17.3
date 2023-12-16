import Joi from "joi"

export const categorySchema = Joi.object({
    _id: Joi.string(),
    category_name: Joi.string().required().messages({
        "string.empty": "Tên danh mục bắt buộc nhập",
        "any.required": "Trường danh mục bắt buộc nhập"
    }),
    category_image: Joi.object().required().messages({
        "any.required": "Trường ảnh danh mục bắt buộc nhập"
    }),
    price_increase_percent: Joi.number().min(1).max(100).required().messages({
        "number.empty": "Giá trị tăng giá tồn kho bắt buộc nhập",
        "any.required": "Trường giá trị tăng giá bắt buộc nhập",
        "number.base": "Giá trị tăng giá sản phẩm phải là số",
        "number.min": "Không được nhập nhỏ hơn 1%",
        "number.max": "Không được nhập trên 100%"
    }),
});