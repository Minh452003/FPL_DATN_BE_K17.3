import Joi from "joi";

export const materialSchema = Joi.object({
    _id: Joi.string(),
    material_name: Joi.string().required().messages({
        "string.empty": "Tên chất liệu không được để trống",
        "any.required": "Trường tên chất liệu bắt buộc nhập"
    })
})
