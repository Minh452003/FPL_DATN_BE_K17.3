import Order from "../models/orders.js"

export const createOrder = async (req, res) => {
    try {
        const order = await Order.create(req.body)
        if (!order) {
            return res.status(404).json({
                error: "Đặt hàng thất bại"
            })
        }
        return res.status(200).json({
            message: "Đặt hàng thành công",
            order
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })

    }
}

export const getOrderByUserId = async (req, res) => {
    try {
        const id = req.params.userId
        const order = await Order.find({ id }).select('-products.productId -status');
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
    const id = req.params.id
    try {
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
        const removeOrder = await Order.findByIdAndDelete(req.params.id);
        if (!removeOrder) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại" + removeOrder,
            })
        }
        return res.status(200).json({
            message: "Xóa đơn hàng thành công!"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const updateOrder = async (req, res) => {
    const id = req.params.id;
    const { statusId } = req.body
    try {
        const updateOrder = await Order.findByIdAndUpdate(id, { status: statusId }, { new: true }).populate('products.productId status')
        if (!updateOrder) {
            return res.status(404).json({
                message: "Đơn hàng không tồn tại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật đơn hàng thành công",
            data: updateOrder
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}