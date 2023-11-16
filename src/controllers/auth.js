import bcrypt from "bcryptjs";
import Auth from "../models/auth.js";
import {
    signinSchema,
    signupSchema,
    updateUserSchema,
} from "../schemas/auth.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import AuthOTPVerification from "../models/authOtpVerification.js";
let refreshTokens = [];

// Lấy tất cả user
export const getAll = async (req, res) => {
    try {
        const data = await Auth.find();
        return res.status(200).json({
            message: "Lấy tất cả người dùng thành công",
            data,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Lấy 1 user
export const getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Auth.findById(id);
        if (data.length === 0) {
            return res.status(404).json({
                message: "Lấy thông tin 1 người dùng thất bại",
            });
        }
        const {
            _id,
            first_name,
            last_name,
            password,
            email,
            address,
            phone,
            role,
            avatar,
            createdAt,
        } = data;

        return res.status(200).json({
            message: "Lấy thông tin 1 người dùng thành công",
            _id,
            first_name,
            last_name,
            password,
            email,
            address,
            phone,
            role,
            avatar,
            createdAt,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Xóa user by Admin
export const removebyAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Auth.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Admin xóa thông tin người dùng thành công",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Xóa user ( Người dùng có thể tự xóa thông tin của chính mình)
export const removebyUser = async (req, res) => {
    try {
        const id = req.params.id;
        const user = await Auth.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Tự xóa chính mình thành công",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Update user (Người dùng có thể tự cập nhật thông tin của chính mình)
export const updateUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = updateUserSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const user = await Auth.findByIdAndUpdate(id, body, { new: true }).select(
            "-password -role -refreshToken -passwordChangeAt -__v"
        );
        console.log(user);
        if (!user) {
            return res.status(400).json({
                message: "Cập nhật thông tin người dùng thất bại",
            });
        }
        return res.status(200).json({
            message: "Tự cập nhật thông tin người dùng thành công!",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Update user by Admin (Admin có thể cập nhật thông tin người dùng)
export const updateUserByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = updateUserSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors,
            });
        }
        const user = await Auth.findByIdAndUpdate(id, body, { new: true }).select(
            "-password -role -refreshToken -passwordChangeAt -__v"
        );
        if (!user) {
            return res.status(404).json({
                message: "Admin cập nhật thông tin người dùng tất cả",
            });
        }
        return res.status(200).json({
            message: "Admin cập nhật thông tin người dùng thành công",
            user,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

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

        // Kiểm tra email đã tồn tại hay chưa
        const userExist = await Auth.findOne({ email });
        if (userExist) {
            return res.status(400).json({
                messsage: "Email đã tồn tại",
            });
        }

        // Mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, 10);

        // Tạo tài khoản
        const user = await Auth.create({
            first_name,
            last_name,
            phone,
            address,
            avatar,
            email,
            password: hashedPassword,
        });

        // Loại bỏ mật khẩu trước khi trả về
        user.password = undefined;

        // Gửi mã OTP qua email và xử lý phản hồi từ hàm này
        const otpResponse = await sendOTPVerificationEmail(user);

        // Gửi gmail thông báo đăng kí thành công
        return res.status(200).json({
            message: "Đăng kí tài khoản thành công",
            user,
            otpResponse
        })

    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};

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

        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({
                message: "Tài khoản không tồn tại",
            });
        }
        const isVerify = user.verified;
        if (!isVerify) {
            await AuthOTPVerification.deleteMany({ userId: user._id });
            const otpResponse = await sendOTPVerificationEmail({
                _id: user._id,
                email,
            });
            return res.status(400).json({
                message: "Vui lòng xác minh tài khoản trước khi đăng nhập",
                otpResponse
            })
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
                sameSite: "strict",
            });
            const { password, ...users } = user._doc;
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

// Gửi OTP
export const sendOTPVerificationEmail = async ({ _id, email }) => {
    try {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`.slice(0, 6);

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });

        // Mail Options
        const mailOptions = {
            from: process.env.MAIL_USERNAME,
            to: email,
            subject: "Nội thất Casa OTP Verification Code",
            html: `
            <p>Vui lòng sử dụng mã OTP để xác thực tài khoản và sử dụng : <span><b>${otp}</b></span></p>
            `
            ,
        };

        //Hash mã OTP
        const saltRounds = 10;
        const hashedOTP = await bcrypt.hash(otp, saltRounds);

        // Lưu OTP vào cơ sở dữ liệu
        const newOTPVerification = new AuthOTPVerification({
            userId: _id,
            otp: hashedOTP,
            createdAt: Date.now(),
            expiresAt: Date.now() + 3600000,
        });

        await newOTPVerification.save();

        // Gửi gmail chứa mã OTP
        await mailTransporter.sendMail(mailOptions);
        // Trả về phản hồi thành công
        return {
            status: "Success",
            message: "Verification otp email send",
            data: {
                userId: _id,
                email,
            },
        };
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Gửi lại mã OTP
export const sendNewOtp = async (req, res) => {
    try {
        const { userId, email } = req.body;
        if (!userId || !email) {
            return res.status(400).json({
                message: "Không được để trống userId và email ",
            });
        }
        const emailCheck = await Auth.findOne({ email })
        if (!emailCheck) {
            return res.status(400).json({
                message: "Email không tồn tại"
            })
        } else {
            await AuthOTPVerification.deleteMany({ userId });
            const otpResponse = await sendOTPVerificationEmail({
                _id: userId,
                email,
            });
            return res.status(200).json({
                message: "Gửi lại mã OTP thành công",
                otpResponse, // Them thông tin về OTP vào phản hồi
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Xác thực OTP thì mới đăng nhập được
export const verifyOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;
        if (!userId || !otp) {
            return res.status(400).json({
                message: "Không được để trống mã otp và userId",
            });
        } else {
            const UserOTPVerificationRecords = await AuthOTPVerification.find({
                userId
            });
            if (UserOTPVerificationRecords.length <= 0) {
                return res.status(404).json({
                    message:
                        "Không tìm thấy bản ghi tài khoản hoặc tài khoản đã được xác minh. Vui lòng đăng ký",
                });
            } else {
                const { expiresAt } = UserOTPVerificationRecords[0];
                const hashedOTP = UserOTPVerificationRecords[0].otp;

                if (expiresAt < Date.now()) {
                    await AuthOTPVerification.deleteMany({ userId });
                    return res.status(400).json({
                        message: "Mã đã hết hạn. Vui lòng yêu cầu lại",
                    });
                } else {
                    const validOTP = await bcrypt.compare(otp, hashedOTP);
                    if (!validOTP) {
                        return res.status(404).json({
                            message: "Mã không hợp lệ.",
                        });
                    } else {
                        // Thành công
                        await sendVerificationEmail(userId);
                        await Auth.updateOne({ _id: userId }, { verified: true });
                        await AuthOTPVerification.deleteMany({ userId });

                        return res.status(200).json({
                            message: "Xác minh email của người dùng thành công!"
                        })
                    }
                }
            }
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

// Hàm gửi gmail xác minh
const sendVerificationEmail = async (userId) => {
    const mailTransporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        },
    });
    const currentUser = await Auth.findById(userId);

    // Soạn nội dung thư
    const details = {
        from: process.env.MAIL_USERNAME,
        to: currentUser.email,
        subject: "📲 Đăng kí thành công Casa Furniture",
        html:
            `
            <h1>Chào mừng bạn đến với Casa ^.^ </h1>
            <p>Xin chào <b>${currentUser.first_name} ${currentUser.last_name},</b></p>
            <p>Chúc mừng bạn đã đăng ký tài khoản thành công. Chúng tôi rất vui mừng chào đón bạn vào cộng đồng của chúng tôi.</p>
            <img src="https://res.cloudinary.com/dkvghcobl/image/upload/v1700052990/hby7nyozorvpib8k7z9h.png" alt="Casa Logo">
            <p>Chúc bạn có một trải nghiệm tuyệt vời với phiên bản hoàn toàn mới này!</p>
            <p>Mọi góp ý và phản hồi bạn liên hệ dưới đây: </p>
            <p>Gmail: casanoithat@gmail.com</p>
            <p>Hotline: 0969085244</p>

        `,
    };

    // Gửi email 
    mailTransporter.sendMail(details, (err) => {
        if (err) {
            console.log("Lỗi khi gửi gmail", err);
        } else {
            console.log("Gửi gmail thành công!");
        }
    })
};


// Generate Access Token
export const generateAccessToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_ACCESS_KEY,
        { expiresIn: "2h" }
    );
};

// Generate Refresh Token
export const generateRefreshToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
        },
        process.env.JWT_REFRESH_KEY,
        { expiresIn: "365d" }
    );
};


// Đăng xuất
export const logout = async (req, res) => {
    try {
        const cookie = req.cookies;
        if (!cookie || !cookie.refreshToken) {
            return res.status(400).json({
                message: "Không thể refresh Token trong cookies",
            });
        }
        // Xóa refresh Token ở DB
        await Auth.findOneAndUpdate(
            { refreshToken: cookie.refreshToken },
            { refreshToken: "" },
            { new: true }
        );
        // Xóa refresh Token ở cookie trình duyệt
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        refreshTokens = refreshTokens.filter(
            (token) => token !== req.cookies.refreshToken
        );
        return res.status(200).json({
            message: "Đăng xuất thành công",
        });
    } catch (error) {
        return res.status(500).json({
            message: error,
        });
    }
};

// Refresh Token
export const refreshToken = async (req, res) => {
    try {
        if (!req.cookies || !req.cookies.refreshToken) {
            return res.status(401).json({
                message: "Bạn chưa đăng nhập. Vui lòng đăng nhập!",
            });
        }

        const refreshToken = req.cookies.refreshToken;
        if (!refreshTokens.includes(refreshToken)) {
            return res.status(403).json({
                message: "Refresh Token không hợp lệ",
            });
        }
        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }
            refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
            // Nếu không lỗi thì sẽ tạo access Token và refresh Token
            const newAccessToken = generateAccessToken(user);
            const newRefreshToken = generateRefreshToken(user);
            refreshTokens.push(newRefreshToken);
            res.cookie("refreshToken", newRefreshToken, {
                httpOnly: true,
                secure: false,
                path: "/",
                // Ngăn chặn tấn công CSRF -> Những cái http, request chỉ được đến từ sameSite
                sameSite: "strict",
            });
            return res.status(200).json({
                message: "Tạo Access Token mới thành công",
                accessToken: newAccessToken,
            });
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};
