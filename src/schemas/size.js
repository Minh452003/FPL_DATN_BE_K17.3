import Joi from "joi";

export const SizeSchema = Joi.object({
    _id: Joi.string(),
    size_name: Joi.string().required().messages({
        "string.empty": "Tên màu không được để trống",
        "any.required": "Trường tên màu bắt buộc nhập"
    }),
    size_price: Joi.number().required().messages({
        "number.empty": "Giá màu bắt buộc nhập",
        "any.required": "Trường giá màu bắt buộc nhập",
        "number.base": "Giá màu phải là số"
    })
})