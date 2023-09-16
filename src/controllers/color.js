import Color from "../models/color.js";
import { ColorSchema } from "../schemas/color.js";

export const getColor = async (req, res) => {
    try {
      const color = await Color.find();
      return res.status(200).json({
        message: " Lấy tất cả màu thành công",
        color
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
};
export const getColorById = async (req, res) => {
    try {
        const id = req.params.id;
        const color = await Color.findById(id);

        return res.status(200).json({
            message: "Lấy 1 màu thành công",
            color
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const createColor = async (req, res) => {
    try {
      const { error } = ColorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          message: error.details.map((err) => err.message),
        });
      }
      const color = await Color.create(req.body);

      return res.status(200).json({
        message: 'Thêm màu thành công',
        color,
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };
  export const removeColor = async (req, res) => {
    try {
      const color = await Color.findByIdAndDelete(req.params.id);
      return res.status(200).json({
        message: 'Xóa màu thành công',
        color,
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };
  export const updateColor = async (req, res) => {
    try {
      const id = req.params.id;
      const body = req.body;
      const { error } = ColorSchema.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => err.message)
        return res.status(400).json({
          message: errors
        })
      }
      const color = await Color.findByIdAndUpdate(id, body, { new: true, });
      return res.status(200).json({
        message: "Cập nhật màu thành công",
        color
      })
    } catch (error) {
      return res.status(400).json({
        message: error.message
      })
    }
  }