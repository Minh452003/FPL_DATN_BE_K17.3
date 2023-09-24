import Joi from "joi";

export const materialSchema = Joi.object({
    _id: Joi.string(),
    material_name: Joi.string().required().messages({
        "string.empty": "Tên chất liệu không được để trống",
        "any.required": "Trường tên chất liệu bắt buộc nhập"
    }),
    material_price: Joi.number().required().messages({
        "number.empty": "Giá chất liệu bắt buộc nhập",
        "any.required": "Trường giá chất liệu bắt buộc nhập",
        "number.base": "Giá chất liệu phải là số"
    })
})
