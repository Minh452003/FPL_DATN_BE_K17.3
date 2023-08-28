import Coupon from "../models/coupons.js"
import { CouponSchema } from "../schemas/coupons.js"


export const createCoupons = async (req, res) => {
    const formDataCoupon = req.body
    try {
        const { error } = CouponSchema.validate(formDataCoupon)
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const addCoupons = await Coupon.create(formDataCoupon)
        if (!addCoupons) {
            return res.status(404).json({
                error: "Dùng phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Dùng phiếu giảm giá thành công",
            addCoupons
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const getOneCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({
                message: "Lấy 1 phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy 1 phiếu đơn hàng thành công",
            coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const getAllCoupons = async (req, res) => {
    try {
        const coupon = await Coupon.find();
        if (!coupon) {
            return res.status(404).json({
                message: "Lấy tất cả phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Lấy tất cả phiếu giảm giá thành công",
            coupon
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}



export const removeCoupons = async (req, res) => {
    try {
        const removeCoupons = await Coupon.findByIdAndDelete(req.params.id);
        if (!removeCoupons) {
            return res.status(404).json({
                message: "Xóa phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Xóa phiếu giảm giá thành công!"
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}


export const updateCoupons = async (req, res) => {
    const id = req.params.id
    const body = req.body
    try {
        const { error } = CouponSchema.validate(req.body, { abortEarly: false })
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const updateCoupons = await Coupon.findByIdAndUpdate( id , body, { new: true })
        if (!updateCoupons) {
            return res.status(404).json({
                message: "Cập nhật phiếu giảm giá thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật phiếu giảm giá thành công",
            updateCouponsSuccess: updateCoupons
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}