
import Session from '../schemas/logout.js';

export const logout = async (req, res) => {
    try {
        // Lấy userId của người dùng từ request (có thể dựa vào phiên đăng nhập hoặc thông tin người dùng)
        const userId = req.body.userId; // Đây là ví dụ, bạn có thể thay đổi cách lấy userId tùy theo cơ cấu của ứng dụng của bạn

        // Xóa phiên đăng nhập của người dùng khỏi cơ sở dữ liệu
        await Session.deleteMany({ userId });

        return res.status(200).json({ message: 'Đăng xuất thành công' });
    } catch (error) {
        return res.status(500).json({ message: 'Lỗi server' });
    }
};

