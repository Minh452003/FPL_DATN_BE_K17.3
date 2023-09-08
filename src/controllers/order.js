import Order from "../models/orders.js"
import { orderSchema } from "../schemas/order.js";
import Coupon from "../models/coupons.js"


export const getOrderByUserId = async (req, res) => {
    try {
        const id = req.params.userId
        const order = await Order.find({ userId:id }).populate('products.productId status');
        return res.status(200).json({
            message: "Lấy thông tin người dùng đặt hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id
        const order = await Order.findById(id).populate('products.productId status')
        if (!order || order.length === 0) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Lấy 1 đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const getAllOrder = async (req, res) => {
    try {
        const order = await Order.find().populate('products.productId status');
        if (!order) {
            return res.status(404).json({
                error: "Lấy tất cả đơn hàng thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy tất cả đơn hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const removeOrder = async (req, res) => {
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Xóa đơn hàng thành công!",
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }

        // Kiểm tra xem có phiếu giảm giá được sử dụng trong đơn hàng không
        if (body.couponId !== null) {
            // Tăng số lượng phiếu giảm giá đã sử dụng lên 1
            const coupon = await Coupon.findById(body.couponId);
            if (coupon) {
                if (coupon.coupon_quantity > 0) {
                    coupon.coupon_quantity -= 1;
                    await coupon.save();
                } else {
                    return res.status(400).json({ message: 'Phiếu giảm giá đã hết lượt sử dụng' });
                }
            }
        }

        const order = await Order.create(body);
        if (!order) {
            return res.status(404).json({
                error: "Đặt hàng thất bại"
            })
        }

        return res.status(200).json({
            message: "Đặt hàng thành công",
            order
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
}


export const updateOrder = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = orderSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const order = await Order.findByIdAndUpdate(id, body, { new: true }).populate('products.productId status')
        if (!order) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            orderUpdateSuccess: order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}