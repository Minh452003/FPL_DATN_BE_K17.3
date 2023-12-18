import Joi from "joi";

export const materialSchema = Joi.object({
    _id: Joi.string(),
    material_name: Joi.string().required().messages({
        "string.empty": "Tên vật liệu không được để trống",
        "any.required": "Trường tên vật liệu bắt buộc nhập"
    })
})
