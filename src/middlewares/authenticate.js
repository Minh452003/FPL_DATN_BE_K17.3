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



// const token = req.headers.authorization
// if (token) {
//     const accessToken = await token.split(" ")[1];
//     jwt.verify(accessToken, process.env.JWT_ACCESS_KEY, (err, user) => {
//         if (err) {
//             return res.status(403).json({
//                 message: "Token không hợp lệ"
//             })
//         }
//         req.user = user
//         next();
//     }
//     )
// }
