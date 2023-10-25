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
            select: 'last_name email avatar',
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy theo sản phẩm bình luận',
            });
        }

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            userId: comment.userId,
            productId: comment.productId,
            description: comment.description,
            formattedCreatedAt: comment.formattedCreatedAt,
            rating: comment.rating
        }));

        return res.status(200).json({
            message: 'Lấy bình luận theo sản phẩm thành công',
            comments: formattedComments,
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
        const comments = await Comment.find().populate({
            path: 'productId',
            select: 'name',
        }).populate({
            path: 'userId',
            select: 'name email image',
        });
        return res.status(200).json({
            message: 'Lấy tất cả bình luận thành công',
            comments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};


export const create = async (req, res) => {
    try {
        const { userId, rating, description, productId } = req.body;
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
        const orders = await Order.find({ userId });
        // Kiểm tra từng đơn hàng
        const productList = [];
        for (const order of orders) {
            for (const product of order.products) {
                productList.push(product);
            }
        }
        const productToReview = productList.find((product) => {
            return (
                !product.hasReviewed && product.productId == productId
            );
        });
        console.log(productToReview);
        if (productToReview) {
            // Nếu sản phẩm có thể đánh giá, đánh giá sản phẩm và cập nhật trạng thái đã đánh giá
            const comment = await Comment.create({
                userId,
                rating,
                description,
                productId,
            });
            // Cập nhật trường hasReviewed của sản phẩm trong mảng products của đơn hàng
            const orderToUpdate = orders.find((order) => {
                return order.products.some((product) => product._id == productToReview._id);
            });

            const productToUpdate = orderToUpdate.products.find((product) => product._id == productToReview._id);
            productToUpdate.hasReviewed = true;

            // Lưu đơn hàng sau khi đã cập nhật
            await orderToUpdate.save();
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



