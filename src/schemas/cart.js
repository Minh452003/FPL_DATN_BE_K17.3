import Joi from "joi";
export const cartSchema = Joi.object({
  _id: Joi.string(),
  userId: Joi.string().required().messages({
    "string.empty": "ID người dùng bắt buộc nhập",
    "any.required": "Trường ID người dùng bắt buộc nhập",
    "string.base": "ID người dùng phải là string",
  }),
  products: Joi.array().required(),
  total: Joi.number().required().min(0),
});
