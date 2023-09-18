import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { signinSchema, signupSchema, updateUserSchema } from "../schemas/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

let refreshTokens = [];

// Lấy tất cả user
export const getAll = async (req, res) => {
    try {
        const data = await User.find();
        return res.status(200).json({
            message: "Lấy tất cả người dùng thành công",
            data
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};

// Lấy 1 user
export const getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await User.findById(id);
        if (data.length === 0) {
            return res.status(404).json({
                message: "Lấy thông tin 1 người dùng thất bại",
            })
        }
        const { _id, first_name, last_name, password, email, address, phone, role, avatar, createdAt } = data;

        return res.status(200).json({
            message: "Lấy thông tin 1 người dùng thành công",
            _id, first_name, last_name, password, email, address, phone, role, avatar, createdAt
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};


// Xóa user by Admin
export const removebyAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Admin xóa thông tin người dùng thành công",
            user
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};

// Xóa user ( Người dùng có thể tự xóa thông tin của chính mình)
export const removebyUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await User.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Tự xóa chính mình thành công",
            user
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};


// Update user (Người dùng có thể tự cập nhật thông tin của chính mình)
export const updateUser = async (req, res) => {
    try {
        const id = req.user
        const body = req.body;
        const { error } = updateUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const user = await User.findByIdAndUpdate(id, body, { new: true }).select('-password -role -refreshToken -passwordChangeAt -__v')
        if (!user) {
            return res.status(400).json({
                message: " Cập nhật thông tin người dùng thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật thông tin người dùng thành công!",
            user
        })

    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}



// Đăng kí
export const signup = async (req, res) => {
    try {
        const { first_name, last_name, email, phone, address, avatar, password } = req.body;
        const { error } = signupSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const userExist = await User.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                messsage: "Email đã tồn tại",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            phone,
            address,
            avatar,
            email,
            password: hashedPassword,
        });

        // Không trả password
        user.password = undefined;

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })
        // gửi mail đăng ký thành công
        const details = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Thông báo đăng ký thành công tài khoản",
            text: "Thông báo đăng ký thành công tài khoản"
        }
        mailTransporter.sendMail(details, (err) => {
            if (err) {
                console.log("err", err)
            } else {
                console.log("success")
            }
        })
        return res.status(201).json({
            message: "Đăng ký thành công",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

// Generate Access Token 
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "2h" }
    )
}

// Generate Refresh Token 
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    )
}

// Đăng nhập
export const signin = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { error } = signinSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                messages: errors,
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Tài khoản không tồn tại",
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu không đúng",
            });
        }
        if (user && password) {
            const accessToken = generateAccessToken(user);
            const refreshToken = generateRefreshToken(user);
            refreshTokens.push(refreshToken);
            // Lưu vào cookies
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
                sameSite: "strict"
            })
            const { password, ...users } = user._doc
            return res.status(200).json({
                message: "Đăng nhập thành công",
                ...users,
                accessToken: accessToken,

            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

// Đăng xuất
export const logout = async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) {
            return res.status(400).json({
                message: "Không thể refresh Token trong cookies"
            })
        }
        // Xóa refresh Token ở DB
        await User.findOneAndUpdate({ refreshToken: cookie.refreshToken }, { refreshToken: '' }, { new: true })
        // Xóa refresh Token ở cookie trình duyệt
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        });
        refreshTokens = refreshTokens.filter(token => token !== req.cookies.refreshToken);
        return res.status(200).json({
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        return res.status(500).json({
            message: error
        });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.refreshToken) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập. Vui lòng đăng nhập!"
            })
        }

        const refreshToken = req.cookies.refreshToken;
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({
                message: "Refresh Token không hợp lệ"
            })
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken)
            // Nếu không lỗi thì sẽ tạo access Token và refresh Token 
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
                sameSite: "strict"
            })
            return res.status(200).json({
                message: "Tạo Access Token mới thành công",
                accessToken: newAccessToken
            })
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }

}
