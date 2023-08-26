import Joi from "joi";

export const CouponSchema = Joi.object({
    _id: Joi.string(),
    coupon_name: Joi.string().required().messages({
        "string.empty": "Tên mã giảm giá bắt buộc nhập",
        "any.required": "Trường tên mã giảm giá bắt buộc nhập"
    }),
    coupon_code: Joi.string().required().messages({
        "string.empty": "Code giảm giá bắt buộc nhập",
        "any.required": "Trường code giảm giá bắt buộc nhập"
    }),
    coupon_content: Joi.string().required().messages({
        "string.empty": "Nội dung mã giảm giá bắt buộc nhập",
        "any.required": "Trường nội dung mã giảm giá bắt buộc nhập"
    }),
    coupon_quanlity: Joi.number().required().messages({
        "number.empty": "Số lượng mã giảm giá bắt buộc nhập",
        "any.required": "Trường số lượng mã giảm giá bắt buộc nhập",
        "number.base": "Số lượng mã giảm giá phải là số"
    }),
    discount_amount: Joi.number().required().messages({
        "number.empty": "Số tiền giảm giá bắt buộc nhập",
        "any.required": "Trường số tiền giảm giá bắt buộc nhập",
        "number.base": "Số tiền giảm giá phải là số"
    }),
    expiration_date: Joi.date().required().messages({
        "any.required": "Ngày hết hạn mã giảm giá bắt buộc nhập",
    }),
})