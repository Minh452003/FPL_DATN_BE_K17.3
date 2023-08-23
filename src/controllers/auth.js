import User from "../models/user.js";
import bcrypt from "bcryptjs";
import { signinSchema, signupSchema } from "../schemas/auth.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
    try {
        const { first_name, last_name,email,phone,address,avatar, password } = req.body;
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
        const token = jwt.sign({ id: user._id }, "DATN", { expiresIn: "1d" });
        return res.status(200).json({
            message: "Đăng nhập thành công",
            accessToken: token,
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};