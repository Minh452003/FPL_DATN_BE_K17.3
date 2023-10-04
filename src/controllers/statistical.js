import Order from '../models/orders.js';
import Product from "../models/products.js";
import Auth from "../models/auth.js";
import Category from "../models/category.js";
import Comment from "../models/comments.js";

export const getTotalOrders = async (req, res) => {
    try {
        const totalOrders = await Order.countDocuments();

        const totalOrderValue = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: '$total' },
                },
            },
        ]);
        res.json({
            totalOrders,
            totalOrderValue: totalOrderValue.length > 0 ? totalOrderValue[0].total : 0,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
export const getProductStatistics = async (req, res) => {
    try {
        // Số lượng sản phẩm đã xem (tổng số lượt xem của tất cả sản phẩm)
        const totalViewedProducts = await Product.aggregate([
            { $group: { _id: null, totalViews: { $sum: '$views' } } },
        ]);

        const totalQuantityProducts = await Product.aggregate([
            { $group: { _id: null, totalQuantity: { $sum: '$sold_quantity' } } },
        ]);
        // Sản phẩm được xem nhiều nhất (sản phẩm có số lượt xem cao nhất)
        const mostViewedProduct = await Product.findOne().sort({ views: -1 });
        // Sản phẩm được mua nhiều nhất (sản phẩm có số lượng mua cao nhất)
        const mostQuantityProduct = await Product.findOne().sort({ sold_quantity: -1 });
        // 
        // Thực hiện aggregation để đếm sản phẩm theo danh mục
        const result = await Product.aggregate([
            {
                $group: {
                    _id: '$categoryId',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Sau khi có kết quả, tìm kiếm thông tin tên danh mục dựa trên categoryId
        const productStats = await Promise.all(result.map(async (item) => {
            const category = await Category.findById(item._id);
            return {
                category: category ? category.category_name : 'Unknown',
                count: item.count,
            };
        }));

        res.json({
            totalViewedProducts: totalViewedProducts.length > 0 ? totalViewedProducts[0].totalViews : 0,
            totalQuantityProducts,
            mostQuantityProduct,
            mostViewedProduct,
            productStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getUserStatistics = async (req, res) => {
    try {
        const accountCount = await Auth.countDocuments();
        const resultCreatedAt = await Auth.aggregate([
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                        day: { $dayOfMonth: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
        ]);
        const resultType = await Auth.aggregate([
            {
                $group: {
                    _id: '$authType',
                    count: { $sum: 1 },
                },
            },
        ]);
        res.json({
            accountCount,
            resultCreatedAt,
            resultType
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}
// 
export const getReviewStatistics = async (req, res) => {
    try {
        // Sử dụng Mongoose để đếm số lượng đánh giá
        const totalReviewCount = await Comment.countDocuments();
        const result = await Comment.aggregate([
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: '$rating' },
                },
            },
        ]);
        // Trích xuất kết quả
        const averageRating = result[0].averageRating;
        // 
        const review = await Comment.aggregate([
            {
                $group: {
                    _id: '$rating',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Tính toán số lượng đánh giá tích cực (cao hơn 3 sao) và tiêu cực (3 sao hoặc thấp hơn)
        const positiveCount = review.filter((item) => item._id > 3).reduce((acc, cur) => acc + cur.count, 0);
        const negativeCount = review.filter((item) => item._id <= 3).reduce((acc, cur) => acc + cur.count, 0);
        res.json({
            totalReviewCount,
            averageRating,
            ratingDistribution: review, positiveCount, negativeCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}