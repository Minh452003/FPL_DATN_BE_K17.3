import Auth from "../models/auth.js";
import crypto from "crypto-js";
import nodemailer from 'nodemailer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { resetPasswordUserSchema,changePasswordUserSchema } from "../schemas/auth.js";




export const forgotPassword = async (req, res) => {
    try {
        const email = req.body.email
        if (!email) {
            return res.status(400).json({
                message: "Không có email!"
            })
        }
        const user = await Auth.findOne({ email: email })
        if (!user) {
            return res.status(404).json({
                message: "Không tìm thấy người dùng"
            })
        }
        const resetToken = crypto.lib.WordArray.random(32).toString();
        user.passwordResetToken = crypto.SHA256(resetToken, 'DATN').toString();
        user.passwordResetExpires = Date.now() + 10 * 60 * 1000;
        await user.save({ validateBeforeSave: false })
        // const resetURL = `${resetToken}`;
        const message = `Vui lòng dùng token để thay đổi mật khẩu của bạn: ${resetToken}`;
        const transporter = nodemailer.createTransport({
            tls: {
                rejectUnauthorized: false
            },
            service: 'gmail',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD
            }
        })
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: req.body.email,
            subject: "Forgot Password",
            text: message
        }
        try {
            await transporter.sendMail(mailOptions)
            return res.status(200).json({
                status: "Gửi Token thành công",
                message: "Vui lòng check gmail để lấy Token để Reset Password"
            })
        } catch (error) {
            user.passwordResetToken = undefined;
            user.passwordResetExpires = undefined;
            await user.save({ validateBeforeSave: false })
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const resetPassword = async (req, res) => {
    try {
        const hashedToken = crypto.SHA256(req.params.token, 'DATN').toString();

        const { error } = resetPasswordUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const user = await Auth.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        })
        if (!user) {
            return res.status(400).json({
                message: "Token reset password hết hạn"
            })
        }

        const hanshedPassword = await bcrypt.hash(req.body.password, 10);
        user.password = hanshedPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        user.passwordChangeAt = Date.now();
        await user.save();
        const token = jwt.sign({ id: user._id }, "DATN", {
            expiresIn: "1d"
        })
        user.password = undefined
        return res.status(200).json({
            message: "Mật khẩu mới được cập nhật",
            user,
            token
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const changePassword = async (req, res) => {
    try {
        const { error } = changePasswordUserSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        const user = req.user
        const isMatch = await bcrypt.compare(req.body.currentPassword, user.password)
        console.log(req.body.currentPassword);
        console.log(user.password);
        if (!isMatch) {
            return res.status(400).json({
                message: "Mật khẩu hiện tại không đúng"
            })
        }
        const hashedNewPassword = await bcrypt.hash(req.body.newPassword, 10);
        const userNew = await Auth.findByIdAndUpdate(req.user._id, { password: hashedNewPassword }, { new: true });
        if (!userNew) {
            return res.status(400).json({
                message: "Không tìm thấy người dùng"
            })
        }
        userNew.passwordChangeAt = Date.now()
        const token = jwt.sign({ id: userNew._id }, "DATN", { expiresIn: "1d" })
        return res.status(200).json({
            message: "Đổi mật khẩu thành công",
            token
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}
