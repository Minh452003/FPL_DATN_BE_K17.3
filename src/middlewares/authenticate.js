import jwt from "jsonwebtoken";
import User from "../models/user.js";

export const authenticate = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(203).json({
                message: "Bạn chưa đăng nhập !",
            });
        }
        const token = req.headers.authorization.split(" ")[1];
        const { id } = jwt.verify(token, "DATN");
        const user = await User.findById(id);
        if (!user) {
            return res.status(203).json({
                message: "Không tìm thấy người dùng"
            })
        }
        req.user = user
        next();


    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

