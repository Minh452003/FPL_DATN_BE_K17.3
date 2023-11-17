import Comment from "../models/comments.js";
import { CommentSchema } from "../schemas/comments.js";
import Product from "../models/products.js";
import Auth from "../models/auth.js";
import Order from "../models/orders.js"

export const getCommentFromProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const comments = await Comment.find({ productId: productId }).populate({
            path: 'userId',
            select: 'first_name last_name email avatar',
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy theo sản phẩm bình luận',
            });
        }
        return res.status(200).json({
            message: 'Lấy bình luận theo sản phẩm thành công',
            comments: comments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const getOneComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'Không tìm thấy bình luận',
            });
        }
        return res.status(200).json({
            message: "Lấy thành công 1 bình luận",
            comment,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const getAllComment = async (req, res) => {
    try {
        const products = await Comment.aggregate([
            {
                $group: {
                    _id: '$productId',
                    count: { $sum: 1 }, // Đếm số lượng bình luận cho mỗi sản phẩm
                },
            },
            {
                $lookup: {
                    from: 'products', // Tên của bảng sản phẩm
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productInfo',
                },
            },
            {
                $unwind: '$productInfo',
            },
            {
                $project: {
                    _id: '$productInfo._id',
                    product_name: '$productInfo.product_name',
                    ratings_count: '$productInfo.ratings_count',
                    comments_count: '$count',
                },
            },
        ]);

        return res.status(200).json({
            message: 'Lấy tất cả sản phẩm đã được đánh giá và số lượng đánh giá thành công',
            products,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const create = async (req, res) => {
    try {
        const { userId, rating, description, productId, orderId, image } = req.body;
        const { error } = CommentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            });
        }
        if (!userId) {
            return res.status(401).json({
                message: "Bạn phải đang nhập mới được đánh giá sản phẩm!",
            });
        }
        // Check if the product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                message: "Sản phẩm không tồn tại.",
            });
        }
        // Check if the user exists
        const user = await Auth.findById(userId);
        if (!user) {
            return res.status(404).json({
                message: "Người dùng không tồn tại.",
            });
        }

        // Tìm tất cả các đơn hàng của người dùng
        const orders = await Order.findOne({ _id: orderId });

        if (orders.hasReviewed === false) {
            // Nếu sản phẩm có thể đánh giá, đánh giá sản phẩm và cập nhật trạng thái đã đánh giá
            const comment = await Comment.create({
                userId,
                rating,
                description,
                productId,
                image
            });
            // Cập nhật trường hasReviewed của sản phẩm trong mảng products của đơn hàng
            orders.hasReviewed = true;
            await orders.save();
            return res.status(200).json({
                message: "Bạn đã đánh giá thành công sản phẩm này!",
                success: true,
                comment,
            });
        } else {
            return res.status(401).json({
                message: "Bạn đã đánh giá sản phẩm này trước đó.",
            });
        }
    } catch (error) {
        console.log(error.message);
        // Xử lý lỗi và trả về lỗi nếu cần thiết
        return res.status(400).json({
            message: error.message,
        });
    }
};




export const updateCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
        return res.status(200).json({
            message: 'Admin thay đổi bình luận thành công',
            comment
        });
    }
    catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};


export const updateCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const body = req.body;
        const { userId = '' } = req.query;
        const { error } = CommentSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const findCommentById = await Comment.findById(id);
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            })
        }
        if (findCommentById.userId == userId) {
            const comment = await Comment.findByIdAndUpdate(id, body, { new: true });
            if (!comment) {
                return res.status(400).json({
                    message: "Thay đổi bình luận của chính mình thất bại"
                })
            }
            return res.status(200).json({
                message: 'Thay đổi bình luận của chính mình thành công',
                comment
            });
        } else {
            return res.status(403).json({
                message: "Bạn không có quyền thay đổi bình luận này!"
            })
        }
    }
    catch (error) {
        return res.status(400).json({
            message: error.message
        });
    }
};



// Remove comment by user ( Người dùng có thể tự xóa comment của chính mình )
export const removeCommentByUser = async (req, res) => {
    try {
        const id = req.params.id;
        const { userId = '' } = req.query;
        const findCommentById = await Comment.findById(id);

        // Kiểm tra nếu không tìm thấy bình luận
        if (!findCommentById) {
            return res.status(404).json({
                message: "Không tìm thấy bình luận"
            });
        }

        // console.log(userId);
        // console.log(findCommentById.userId);
        if (findCommentById.userId == userId) {
            // Xóa bình luận
            const comment = await Comment.findByIdAndDelete(id);
            return res.status(200).json({
                message: "Xóa bình luận thành công",
                comment
            });
        } else {
            // Trả về mã lỗi 403 nếu người dùng không có quyền xóa bình luận này
            return res.status(403).json({
                message: "Bạn không có quyền xóa bình luận này"
            });
        }
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};


// Remove comment by admin 
export const removeCommentByAdmin = async (req, res) => {
    try {
        const id = req.params.id
        const comment = await Comment.findByIdAndDelete(id);

        return res.status(200).json({
            message: 'Admin xóa bình luận thành công!',
            comment
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};



