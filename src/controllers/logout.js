import { logoutSchema } from "../schemas/logout.js";
 
export const logout = async (req, res) => {
  try {
      const { error } = logoutSchema.validate(req.body, { abortEarly: false });
      if (error) {
          const errors = error.details.map((err) => err.message);
          return res.status(400).json({
              messages: "Bạn chưa đăng nhập. Vui lòng đăng nhập trước khi đăng xuất",
          });
      }

      return res.status(200).json({
          message: "Đăng xuất thành công",
      });
  } catch (error) {
      return res.status(500).json({
          message: error
      });
  }
};