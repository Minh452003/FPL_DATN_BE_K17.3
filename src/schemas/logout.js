import joi from "joi";
export const logoutSchema = joi.object({
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