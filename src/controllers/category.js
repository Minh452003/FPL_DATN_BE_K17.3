import { categorySchema } from "../schemas/category.js";
import Category from "../models/category.js";

export const addCategory = async (req, res) => {
    try {
        const body = req.body;
        const { error } = categorySchema.validate(body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((item) => item.message)
            })
        }
        const data = await Category.create(body);
        if (data.length === 0) {
            return res.status(400).json({
                message: "Thêm danh mục thất bại"
            })
        }
        return res.status(200).json({
            message: "Thêm danh mục thành công!",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const updateCategory = async (req, res) => {
    try {
        const data = await Category.findOneAndUpdate({ _id: req.params.id }, req.body, { new: true })
        if (!data) {
            return res.status(400).json({
                message: "Cập nhật danh mục thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật danh mục thành công",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}