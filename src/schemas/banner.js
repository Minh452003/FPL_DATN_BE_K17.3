import Joi from 'joi'

export const bannerSchema = Joi.object({
    
    image1: Joi.object().required().messages({
        "any.required": "Trường ảnh Banner bắt buộc nhập"
    }),
    image2: Joi.object().required().messages({
        "any.required": "Trường ảnh Banner bắt buộc nhập"
    }),
    image3: Joi.object().required().messages({
        "any.required": "Trường ảnh Banner bắt buộc nhập"
    }),
    image4: Joi.object().required().messages({
        "any.required": "Trường ảnh Banner bắt buộc nhập"
    })
});