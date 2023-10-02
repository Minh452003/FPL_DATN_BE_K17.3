import Joi from "joi";

export const CustomizedProductSchema = Joi.object({
    _id: Joi.string(),
    userId: Joi.string().required().messages({
        'any.required': 'userId không được để trống.',
    }),
    productId: Joi.string().required().messages({
        'any.required': 'productId không được để trống.',
    }),
    product_name: Joi.string().required().messages({
        "string.empty": "Tên sản phẩm bắt buộc nhập",
        "any.required": "Trường tên sản phẩm bắt buộc nhập"
    }),
    product_price: Joi.number().required().messages({
        "number.empty": "Giá sản phẩm bắt buộc nhập",
        "any.required": "Trường giá sản phẩm bắt buộc nhập",
        "number.base": "Giá sản phẩm phải là số"
    }),
    image: Joi.object().required().messages({
        "any.required": "Trường ảnh sản phẩm bắt buộc nhập"
    }),
    description: Joi.string(),
    stock_quantity: Joi.number().required().messages({
        "number.empty": "Số lượng tồn kho bắt buộc nhập",
        "any.required": "Trường Số lượng tồn kho bắt buộc nhập",
        "number.base": "Số lượng tồn kho sản phẩm phải là số"
    }),
    categoryId: Joi.string().required().messages({
        "string.empty": "Danh mục sản phẩm bắt buộc nhập",
        "any.required": "Trường danh mục sản phẩm bắt buộc nhập",
        "string.base": "Danh mục sản phẩm phải là chuỗi"
    }),
    brandId: Joi.string().required().messages({
        "string.empty": "Thương hiệu bắt buộc nhập",
        "any.required": "Trường thương hiệu bắt buộc nhập",
        "string.base": "Thương hiệu phải là chuỗi"
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
    }),
    materialId: Joi.string().required().messages({
        "string.empty": "Chất liệu bắt buộc nhập",
        "any.required": "Trường chất liệu bắt buộc nhập",
        "string.base": "Chất liệu phải là chuỗi"
    })
})