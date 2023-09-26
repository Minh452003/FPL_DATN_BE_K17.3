import Joi from "joi";

export const SizeSchema = Joi.object({
    _id: Joi.string(),
    size_name: Joi.string().required().messages({
        "string.empty": "Tên size không được để trống",
        "any.required": "Trường tên size bắt buộc nhập"
    }),
    size_price: Joi.number().required().messages({
        "number.empty": "Giá size bắt buộc nhập",
        "any.required": "Trường giá size bắt buộc nhập",
        "number.base": "Giá size phải là số"
    }),
    size_height: Joi.number().required().messages({
        "number.empty": "Chiều cao bắt buộc nhập",
        "any.required": "Trường chiều cao bắt buộc nhập",
        "number.base": "Chiều cao phải là số"
    }),
    size_length: Joi.number().required().messages({
        "number.empty": "Chiều dài bắt buộc nhập",
        "any.required": "Trường chiều cao bắt buộc nhập",
        "number.base": "Chiều dài phải là số"
    }),
    size_weight: Joi.number().required().messages({
        "number.empty": "Trọng lượng sản phẩm bắt buộc nhập",
        "any.required": "Trường trọng lượng sản phẩm bắt buộc nhập",
        "number.base": "Trọng lượng sản phẩm phải là số"
    }),
    size_width: Joi.number().required().messages({
        "number.empty": "Chiều rộng bắt buộc nhập",
        "any.required": "Trường chiều rộng bắt buộc nhập",
        "number.base": "Chiều rộng phải là số"
    })
})
