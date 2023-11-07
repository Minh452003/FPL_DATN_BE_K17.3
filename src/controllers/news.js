import New from "../models/news.js";
import { newSchema } from "../schemas/news.js";


export const getNewList = async (req, res) => {
    try {
        const news = await New.find();
        if (news.length === 0) {
            return res.status(404).json({
                message: 'Lấy tất cả tin tức thất bại',
            });
        }
        return res.status(200).json({
            message: " Lấy tất cả tin tức thành công",
            news
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


export const createNews = async (req, res) => {
    try {
        const { error } = newSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const news = await New.create(req.body);
        if (!news) {
            return res.status(400).json({
                message: 'Thêm tin tức thất bại',
            });
        }
        return res.status(200).json({
            message: 'Thêm tin tức thành công',
            news,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const updateNews = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = newSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message)
            return res.status(400).json({
                message: errors
            })
        }
        const news = await New.findByIdAndUpdate(id, body, { new: true, });
        if (!news) {
            return res.status(404).json({
                message: 'Cập nhật tin tức thất bại',
            });
        }
        return res.status(200).json({
            message: "Cập nhật tin tức thành công",
            news
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
};


export const removeNews = async (req, res) => {
    try {
        const news = await New.findByIdAndDelete(req.params.id);
        return res.status(200).json({
            message: 'Xóa tin tức thành công',
            news
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const getNewByOneId = async (req, res) => {
    try {
        const id = req.params.id;
        const news = await New.findById(id);
        if (news.length === 0) {
            return res.status(400).json({
                message: "Không có dữ liệu!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 tin tức thành công",
            news
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};