import Joi from "joi";
export const CommentSchema = Joi.object({
    _id: Joi.string(),
    description: Joi.string(),
    userId: Joi.string().required().messages({
        "string.empty": "ID người dùng bắt buộc nhập",
        "any.required": "Trường ID người dùng bắt buộc nhập",
        "string.base": "ID người dùng phải là string"
    }),
    productId: Joi.string().required().messages({
        "string.empty": "ID sản phẩm bắt buộc nhập",
        "any.required": "Trường ID sản phẩm bắt buộc nhập",
        "string.base": "ID sản phẩm phải là string"
    }),
})