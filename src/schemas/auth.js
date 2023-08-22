import joi from "joi";

export const signupSchema = joi.object({
    name: joi.string().required().messages({
        "string.empty": "Tên không được để trống",
        "any.required": 'Trường "Tên" là bắt buộc',
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
});
export const signinSchema = joi.object({
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
});