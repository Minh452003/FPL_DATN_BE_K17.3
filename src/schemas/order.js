import Joi from "joi";
export const orderSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        "string.empty": "ID người dùng bắt buộc nhập",
        "any.required": "Trường ID người dùng bắt buộc nhập",
        "string.base": "ID người dùng phải là string"
    }),
    couponld: Joi.string().required().messages({
        "string.empty": "ID sản phẩm bắt buộc nhập",
        "any.required": "Trường ID sản phẩm bắt buộc nhập",
        "string.base": "ID sản phẩm phải là string"
    }),
    products: Joi.array().required(),
    total: Joi.number().required().min(0),
    status: Joi.string(),
    phone: Joi.string().max(12).required().messages({
        "string.empty": "Mời điền số điện thoại",
        "any.required": "bắt buộc thêm số điện thoại",
        "string.max": "Số phải phải có ít hơn 12 số",
    }),
    address: Joi.string().required().messages({
        "string.empty": "Thêm địa chỉ ",
        "any.required": 'Trường "Địa chỉ" là bắt buộc',
    }),
    notes: Joi.string()
})