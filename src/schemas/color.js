import Joi from "joi";

export const ColorSchema = Joi.object({
    _id: Joi.string(),
    colors_name: Joi.string().required().messages({
        "string.empty": "Tên màu không được để trống",
        "any.required": "Trường tên màu bắt buộc nhập"
    }),
    colors_price: Joi.number().required().messages({
        "number.empty": "Giá màu bắt buộc nhập",
        "any.required": "Trường giá màu bắt buộc nhập",
        "number.base": "Giá màu phải là số"
    }),
    colors_image: Joi.object().required().messages({
        "any.required": "Trường ảnh màu bắt buộc nhập"
    }),
})