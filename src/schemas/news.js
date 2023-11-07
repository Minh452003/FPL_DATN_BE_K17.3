import Joi from "joi";

export const newSchema = Joi.object({
    _id: Joi.string(),
    new_title: Joi.string().required().messages({
        "string.empty": "Tin tức không được để trống",
        "any.required": "Trường tin tức bắt buộc nhập"
    }),
    new_content: Joi.string().required().messages({
        "string.empty": "New không được để trống",
        "any.required": "Trường tin tức bắt buộc nhập",
    }),
    image: Joi.string().required().messages({
        "any.required": "Trường ảnh tin tức bắt buộc nhập"
    }),
})
