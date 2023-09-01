import Cart from '../models/cart.js'
import User from "../models/user.js";
import mongoose from 'mongoose'
import { cartSchema } from '../schemas/cart.js';
import Coupon from "../models/coupons.js"
import Order from "../models/orders.js"


export const resetCart = async (idUser) => {
    try {
        const cartExist = await Cart.findOne({ userId: idUser })
        const productsUpdated = []
        cartExist.products = productsUpdated
        const cartUpdated = await Cart.findOneAndUpdate({ _id: cartExist._id }, cartExist, { new: true })
        return cartUpdated
    } catch (error) {
        console.log(error.message)
        return {}
    }
}


const addProduct = async (cartExist, productAdd, res) => {
    try {
        const productExist = cartExist.products.find((product) => product.productId === productAdd.productId);
        if (productExist) {
            productExist.stock_quantity += productAdd.stock_quantity;
            cartExist.total += productAdd.stock_quantity * productAdd.product_price;
        } else {
            cartExist.products.push(productAdd);
            cartExist.total += productAdd.stock_quantity * productAdd.product_price;
        }
        // Kiểm tra xem phiếu giảm giá đã được áp dụng
        if (cartExist.couponId !== null) {
            // Tính lại tổng tiền bằng cách cộng với giá của sản phẩm mới
            cartExist.total = cartExist.originalTotal + (productAdd.stock_quantity * productAdd.product_price);
            cartExist.couponId = null
            cartExist.originalTotal = 0
        }
        // Lưu giỏ hàng sau khi cập nhật (không có phiếu giảm giá)
        const cartUpdated = await Cart.findOneAndUpdate({ _id: cartExist._id }, cartExist, { new: true })
        return res.status(200).json({
            message: 'Thêm vào giỏ hàng thành công',
            data: cartUpdated
        });
    } catch (error) {
        console.log(error.message);
        return res.status(400).json({
            message: 'Thêm vào giỏ hàng không thành công'
        });
    }
};



export const create = async (req, res) => {
    try {
        const userId = req.params.id
        const productNeedToAdd = req.body
        const userExist = await User.findById(userId)
        if (!userExist) {
            return res.status(404).json({
                message: 'Người dùng không tồn tại !'
            })
        }
        const { error } = cartSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const cartExist = await Cart.findOne({ userId: userId })
        if (cartExist) {
            return addProduct(cartExist, productNeedToAdd, res)
        }
        const newCart = await Cart.create({
            userId,
            products: [
                {
                    productId: productNeedToAdd._id,
                    ...productNeedToAdd
                }
            ],
            total: productNeedToAdd.product_price * productNeedToAdd.stock_quantity,
        })
        if (!newCart) {
            return res.status(400).json({
                message: 'Thêm vào giỏ hàng thất bại'
            })
        }
        return res.status(200).json({
            message: 'Thêm vào giỏ hàng thành công',
            data: newCart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const getOne = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.params.id })
        if (!cart) {
            return res.status(404).json({
                message: 'Không tìm thấy giỏ hàng',
                data: []
            })
        }
        return res.status(200).json({
            message: 'Lấy giỏ hàng thành công',
            data: cart
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const changeQuantity = async (req, res) => {
    try {
        const idUser = req.params.id
        const { idProduct = '' } = req.query
        const { stock_quantity } = req.body
        const userExist = await User.findOne({ _id: idUser })
        if (!userExist) {
            return res.status(404).json({
                message: 'Vui lòng đăng nhập!'
            })
        }
        const cart = await Cart.findOne({ userId: idUser })
        const productExt = cart.products.find((product) => product.productId === idProduct)
        if (productExt) {
            productExt.stock_quantity = stock_quantity
            const productsUpdated = [...cart.products.filter((product) => product.productId !== idProduct), productExt]
            const totalUpdated = productsUpdated.reduce((total, product) => {
                return (total += product.stock_quantity * product.product_price)
            }, 0)
            const cartUpdated = await Cart.findOneAndUpdate(
                { userId: idUser },
                { $set: { products: productsUpdated, total: totalUpdated } },
                { new: true }
            )

            return res.status(200).json({
                message: 'Thay đổi sản phẩm thành công',
                data: cartUpdated
            })
        }
        return res.status(400).json({
            message: 'Sản phẩm không tồn tại!',
            data: {}
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const removeProduct = async (req, res) => {
    try {
        const idUser = req.params.id
        const { idProduct = '' } = req.query
        const userExist = await User.findOne({ _id: idUser })
        if (!userExist) {
            return res.status(404).json({
                message: 'Vui lòng đăng nhập!'
            })
        }
        const cart = await Cart.findOne({ userId: idUser })
        const productsUpdated = cart.products.filter((product) => product.productId !== idProduct)
        const totalUpdated = productsUpdated.reduce((total, product) => {
            return (total += product.stock_quantity * product.product_price)
        }, 0)
        const cartUpdated = await Cart.findOneAndUpdate(
            { userId: idUser },
            { $set: { products: productsUpdated, total: totalUpdated } },
            { new: true }
        )
        return res.status(200).json({
            message: 'Xóa sản phẩm thành công',
            data: cartUpdated
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}

export const clearUserCart = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.params.id);
        const cartExist = await Cart.findOne({ userId });

        if (!cartExist) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }

        cartExist.products = []; // Xoá tất cả sản phẩm trong giỏ hàng
        cartExist.total = 0;// Đặt tổng giá trị về 0
        cartExist.originalTotal = 0
        cartExist.couponId = null
        const cartUpdated = await Cart.findOneAndUpdate({ _id: cartExist._id }, cartExist, { new: true });

        return res.status(200).json({
            message: 'Xoá tất cả sản phẩm trong giỏ hàng thành công',
            data: cartUpdated,
        });
    } catch (error) {
        console.error(error); // In ra thông tin lỗi cụ thể
        return res.status(500).json({ message: 'Xoá tất cả sản phẩm trong giỏ hàng không thành công' });
    }
};

// Áp dụng mã phiếu giảm giá vào giỏ hàng
const applyCouponToCart = async (userId, couponId) => {
    try {
        const cart = await Cart.findOne({ userId });
        const coupon = await Coupon.findById(couponId);
        if (coupon.discount_amount) {
            // Lưu trữ giá trị ban đầu của total
            cart.originalTotal = cart.total;

            // Tính toán giảm giá dựa trên phần trăm và tổng giỏ hàng
            const discountAmount = (coupon.discount_amount / 100) * cart.total;

            // Cập nhật giỏ hàng với giảm giá
            cart.total -= discountAmount;

            // Đánh dấu giỏ hàng đã áp dụng mã phiếu giảm giá
            cart.couponId = coupon._id;

            // Lưu giỏ hàng sau khi cập nhật
            const updatedCart = await cart.save();

            return updatedCart;
        }

        return cart;
    } catch (error) {
        throw error;
    }
};

// Sử dụng hàm applyCouponToCart trong route handler
export const applyCoupon = async (req, res) => {
    try {
        const userId = req.params.id;
        const couponId = req.body.couponId;

        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(404).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }
        if (cart.couponId != null) {
            return res.status(404).json({ message: 'Chỉ được sử dụng 1 phiếu giảm giá' });
        }

        const coupon = await Coupon.findById(couponId);
        if (cart.total < coupon.min_purchase_amount) {
            return res.status(404).json({ message: 'Không đủ điều kiện để sử dụng phiếu giảm giá' })
        }
        if (!coupon) {
            return res.status(404).json({ message: 'Mã phiếu giảm giá không hợp lệ' });
        }
        // check xem người dùng đã sử dụng phiếu giảm giá này để order hay chưa
        const orderWithCoupon = await Order.findOne({ couponId: couponId });
        if (orderWithCoupon) {
            return res.status(400).json({ message: 'Phiếu giảm giá đã được sử dụng' });
        }

        // Kiểm tra xem phiếu giảm giá có quá hạn không
        const currentDate = new Date();
        if (currentDate > coupon.expiryDate) {
            return res.status(400).json({ message: 'Mã phiếu giảm giá đã hết hạn' });
        }

        // Áp dụng mã phiếu giảm giá vào giỏ hàng bằng cách gọi hàm applyCouponToCart
        const updatedCart = await applyCouponToCart(userId, couponId);

        return res.json({
            message: 'Áp dụng phiếu giảm giá thành công',
            data: updatedCart,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi áp dụng phiếu giảm giá' });
    }
};

// Hủy bỏ sử dụng mã phiếu giảm giá
const removeCouponFromCart = async (userId) => {
    try {
        const cart = await Cart.findOne({ userId });
        // Kiểm tra xem có mã phiếu giảm giá đã được áp dụng không
        if (cart.couponId) {
            // Khôi phục total từ originalTotal
            cart.total = cart.originalTotal;
            // Đặt couponId về null để đánh dấu là không sử dụng mã phiếu giảm giá
            cart.couponId = null;
            cart.originalTotal = 0;
            // Lưu giỏ hàng sau khi cập nhật
            const updatedCart = await cart.save();

            return updatedCart;
        }

        return cart;
    } catch (error) {
        throw error;
    }
};

// Sử dụng hàm removeCouponFromCart trong route handler để huỷ bỏ sử dụng mã phiếu giảm giá
export const removeCoupon = async (req, res) => {
    try {
        const userId = req.params.id;
        const cart = await Cart.findOne({ userId });
        if (!cart) {
            return res.status(400).json({ message: 'Không tìm thấy giỏ hàng cho người dùng này' });
        }
        if (cart.couponId == null) {
            return res.status(400).json({ message: 'Không sử dụng phiếu giảm giá' });
        }
        const updatedCart = await removeCouponFromCart(userId);
        return res.json({
            message: 'Huỷ bỏ sử dụng phiếu giảm giá thành công',
            data: updatedCart,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Có lỗi xảy ra khi huỷ bỏ sử dụng phiếu giảm giá' });
    }
};
