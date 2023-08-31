import user from "../models/user.js";
import bcrypt from "bcryptjs";
import User from "../models/user.js";
import { changePasswordSchema, signinSchema, signupSchema } from "../schemas/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"

export const getAll = async (req, res) => {
    try {
        const data = await user.find();
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

export const getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await user.findById(id);
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

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await user.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Xóa thông tin người dùng thành công",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        })
    }
};

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

export const changePassword = async (req, res) => {
    try {
      const { error } = changePasswordSchema.validate(body, { abortEarly: false });
      if (error) {
        const errors = error.details.map((err) => err.message);
        return res.status(400).json({
          message: errors,
        });
      }
  
      const user = await user.findOne({ email: req.body.email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Compare old password
      const passwordMatch = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!passwordMatch) {
        return res.status(400).json({ error: "Invalid old password" });
      }
  
      // Hash and update new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(req.body.newPassword, saltRounds);
      user.password = hashedPassword;
  
      await user.save();
      return res.status(200).json({ message: "Password changed successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed!" });
    }
  };