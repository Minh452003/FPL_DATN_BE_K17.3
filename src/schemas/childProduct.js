import Joi from "joi";

export const childProductSchema = Joi.object({
    _id: Joi.string(),
    productId: Joi.string().required().messages({
        'any.required': 'productId không được để trống.',
    }),
    product_price: Joi.number().required().messages({
        "number.empty": "Giá sản phẩm bắt buộc nhập",
        "any.required": "Trường giá sản phẩm bắt buộc nhập",
        "number.base": "Giá sản phẩm phải là số"
    }),
    stock_quantity: Joi.number().required().messages({
        "number.empty": "Số lượng tồn kho bắt buộc nhập",
        "any.required": "Trường Số lượng tồn kho bắt buộc nhập",
        "number.base": "Số lượng tồn kho sản phẩm phải là số"
    }),
    colorId: Joi.string().required().messages({
        "string.empty": "Màu bắt buộc nhập",
        "any.required": "Trường màu bắt buộc nhập",
        "string.base": "Màu phải là chuỗi"
    }),
    sizeId: Joi.string().required().messages({
        "string.empty": "Kích cỡ bắt buộc nhập",
        "any.required": "Trường kích cỡ bắt buộc nhập",
        "string.base": "Kích cỡ phải là chuỗi"
    })
})