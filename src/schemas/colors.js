import Joi from "joi";

export const colorSchema = Joi.object({
    _id: Joi.string(),
    colors_name: Joi.string().required().messages({
        "string.empty": "Trường tên màu không được để trống",
        "any.required": "Trường tên màu là bắt buộc",
    })
})