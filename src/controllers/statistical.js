import Order from '../models/orders.js';
import Product from "../models/products.js";
import Auth from "../models/auth.js";
import Category from "../models/category.js";
import Comment from "../models/comments.js";

export const getRevenueAndProfit = async (req, res) => {
    try {
        const { year, month } = req.query;
        let matchCondition = {}; // Điều kiện tìm kiếm dựa trên năm và/hoặc tháng

        if (year) {
            matchCondition.year = parseInt(year);
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        if (month) {
            matchCondition.month = parseInt(month);
        }

        if (!year && !month) {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        // Sử dụng aggregation framework của MongoDB để thống kê doanh thu và lợi nhuận
        const revenueAndProfit = await Order.aggregate([
            {
                $project: {
                    year: { $year: '$createdAt' },
                    month: { $month: '$createdAt' },
                    total: 1, // Tổng tiền của đơn hàng
                },
            },
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                    },
                    total: { $sum: '$total' },
                    profit: { $sum: { $multiply: ['$total', 0.25] } }, // Tính lợi nhuận (25%)
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    total: 1,
                    profit: 1,
                },
            },
            {
                $sort: {
                    year: 1,
                },
            },
        ]);

        res.json(revenueAndProfit);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTopSellingProducts = async (req, res) => {
    try {
        const { year, month } = req.query;
        let query = {};

        if (year && month) {
            query = {
                $and: [
                    { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } },
                    { $expr: { $eq: [{ $month: '$createdAt' }, parseInt(month)] } }
                ]
            };
        } else if (year) {
            query = { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } };
        } else if (month) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        // Thực hiện truy vấn dựa trên query
        const topSellingProducts = await Product.aggregate([
            {
                $match: query,
            },
            {
                $sort: { sold_quantity: -1 },
            },
            {
                $limit: 5, // Lấy top 5 sản phẩm
            },
        ]);

        res.json(topSellingProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTopViewedProducts = async (req, res) => {
    try {
        const { year, month } = req.query;
        let query = {};

        if (year && month) {
            query = {
                $and: [
                    { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } },
                    { $expr: { $eq: [{ $month: '$createdAt' }, parseInt(month)] } }
                ]
            };
        } else if (year) {
            query = { $expr: { $eq: [{ $year: '$createdAt' }, parseInt(year)] } };
        } else if (month) {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        // Thực hiện truy vấn dựa trên query
        const topSellingProducts = await Product.aggregate([
            {
                $match: query,
            },
            {
                $sort: { views: -1 },
            },
            {
                $limit: 5, // Lấy top 5 sản phẩm
            },
        ]);

        res.json(topSellingProducts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

export const getTotalSoldQuantity = async (req, res) => {
    try {
        const { year, month } = req.query;
        const matchCondition = {}; // Điều kiện tìm kiếm dựa trên năm và/hoặc tháng
        const projectFields = {
            sold_quantity: 1,
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
        };

        if (year) {
            matchCondition.year = parseInt(year);
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        if (month) {
            matchCondition.month = parseInt(month);
        }

        if (!year && !month) {
            return res.status(400).json({ error: 'Thiếu thông tin tháng hoặc năm trong yêu cầu.' });
        }

        const aggregationStages = [
            {
                $project: projectFields,
            },
            {
                $match: matchCondition,
            },
            {
                $group: {
                    _id: {
                        year: '$year',
                        month: '$month',
                    },
                    totalSoldQuantity: { $sum: '$sold_quantity' },
                },
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    totalSoldQuantity: 1,
                },
            },
            {
                $sort: {
                    year: 1,
                    month: 1,
                },
            },
        ];

        // Kiểm tra nếu không có điều kiện tháng (chỉ có năm), thì gộp tất cả dữ liệu thành 1
        if (!month) {
            aggregationStages.splice(2, 1, {
                $group: {
                    _id: {
                        year: '$year',
                    },
                    totalSoldQuantity: { $sum: '$sold_quantity' },
                },
            });
        }

        const totalSoldQuantity = await Product.aggregate(aggregationStages);

        res.json(totalSoldQuantity);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}



export const getUserStatistics = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const groupFields = { year: { $year: '$createdAt' } };
        if (month) {
            groupFields.month = { $month: '$createdAt' };
        }

        const result = await Auth.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: groupFields,
                    count: { $sum: 1 },
                },
            },
        ]);

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

// 
export const getReviewStatistics = async (req, res) => {
    try {
        const { year, month } = req.query;
        const aggregationStages = [];

        if (year) {
            aggregationStages.push({
                $match: {
                    createdAt: {
                        $gte: new Date(parseInt(year), 0, 1),
                        $lt: new Date(parseInt(year) + 1, 0, 1),
                    },
                },
            });

            if (month) {
                aggregationStages[0].$match.createdAt = {
                    $gte: new Date(parseInt(year), parseInt(month) - 1, 1),
                    $lt: new Date(parseInt(year), parseInt(month), 1),
                };
            }
        } else {
            return res.status(400).json({ error: 'Thiếu thông tin năm trong yêu cầu.' });
        }

        const result = await Comment.aggregate([
            ...aggregationStages,
            {
                $group: {
                    _id: null,
                    totalReviewCount: { $sum: 1 },
                    averageRating: { $avg: '$rating' },
                    reviewDistribution: {
                        $push: {
                            rating: '$rating',
                        },
                    },
                },
            },
        ]);
        if (result.length === 0) {
            return res.status(400).json({ error: 'Không có đánh giá.' });
        }
        const totalReviewCount = result[0].totalReviewCount;
        const averageRating = (result[0].averageRating).toFixed(2);
        const reviewDistribution = result[0].reviewDistribution;

        const positiveCount = reviewDistribution.filter((item) => item.rating > 3).length;
        const negativeCount = reviewDistribution.filter((item) => item.rating <= 3).length;

        res.json({
            tongdanhgia: totalReviewCount,
            trungbinh: averageRating,
            tichcuc: positiveCount,
            tieucuc: negativeCount,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi trong quá trình xử lý.' });
    }
}

