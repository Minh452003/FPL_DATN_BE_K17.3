import joi from "joi";

export const signupSchema = joi.object({
    first_name: joi.string().required().messages({
        "string.empty": "Mời nhập tên",
        "any.required": 'Trường "Tên" là bắt buộc',
    }),
    last_name: joi.string().required().messages({
        "string.empty": "Mời nhập họ",
        "any.required": 'Trường "Họ" là bắt buộc',
    }),
    email: joi.string().email().required().messages({
        "string.empty": "Email không được để trống",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    }),
    confirmPassword: joi.string().valid(joi.ref("password")).required().messages({
        "any.only": "Mật khẩu không khớp",
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
    }),
    phone: joi.string().max(12).required().messages({
        "string.empty": "Mời điền số điện thoại",
        "any.required": "bắt buộc thêm số điện thoại",
        "string.max": "Số phải phải có ít hơn 12 số",
    }),
    address: joi.string().required().messages({
        "string.empty": "Thêm địa chỉ ",
        "any.required": 'Trường "Tên" là bắt buộc',
    })
});
export const signinSchema = joi.object({
    email: joi.string().email().required().messages({
        "string.empty": "Mời nhập email ",
        "any.required": 'Trường "Email" là bắt buộc',
        "string.email": "Email không đúng định dạng",
    }),
    password: joi.string().min(6).required().messages({
        "string.empty": "Mật khẩu không được để trống",
        "any.required": "Trường mật khẩu là bắt buộc",
        "string.min": "Mật khẩu phải có ít nhất {#limit} ký tự",
    }),
});