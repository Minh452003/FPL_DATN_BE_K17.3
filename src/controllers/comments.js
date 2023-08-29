
import Comment from "../models/comments.js";
import { CommentSchema } from "../schemas/comments.js";
import Product from "../models/products.js";
import User from "../models/user.js";

export const getCommentFromProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const comments = await Comment.find({ productId: productId }).populate({
            path: 'userId',
            select: 'last_name email avatar',
        });
        if (!comments || comments.length === 0) {
            return res.status(404).json({
                message: 'Không tìm thấy bình luận',
            });
        }

        const formattedComments = comments.map(comment => ({
            _id: comment._id,
            userId: comment.userId,
            productId: comment.productId,
            description: comment.description,
            formattedCreatedAt: comment.formattedCreatedAt,
        }));

        return res.status(200).json({
            message: 'Lấy thành công comment',
            comments: formattedComments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};



export const getOneComment = async (req, res) => {
    const { id } = req.params;

    try {
        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({
                message: 'Không tìm thấy bình luận',
            });
        }
        return res.status(200).json({
            message: "Lấy thành công comment",
            comment,
        });
    }
    catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}

export const create = async (req, res) => {
    const { userId, rating, description, productId } = req.body;
    try {
        const { error } = CommentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
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
        const user = await User.findById(userId);

          if (!user) {
          return res.status(404).json({
          message: "Người dùng không tồn tại.",
          });
        }

          // Check if the user already reviewed the product
    const existingComment = await Comment.findOne({ userId, productId });

        if (existingComment) {
          return res.status(401).json({
          message: "Bạn đã đánh giá sản phẩm này trước đó.",
         });
        }
        const user_fullName = user?.user_fullName;
        const user_avatar = user?.user_avatar;
        const comment = await Comment.create({
        user_fullName,
        user_avatar,
        userId,
        rating,
        description,
        productId,
    });
       const comments = await Comment.find({ productId });
        const totalRating = comments.reduce(
         (totalRating, rating) => totalRating + rating.rating,
        0
      );
     // Tính toán số lượng sao và lươtj đánh giá
        const reviewCount = comments.length;
         const averageScore = totalRating / reviewCount;
 
         product.average_score = Math.round(averageScore);
         product.review_count = reviewCount;
        await product.save();
     if (user) {
       return res.status(200).json({
         message: "Bạn đã đánh giá thành công sản phẩm này!",
         success: true,
         comment,
       });
     }
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}



export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;
    try {
        const { error } = CommentSchema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const comment = await Comment.findByIdAndUpdate(id, { description }, {
            new: true
        });
        return res.status(200).json({
            message: 'Cập nhật thành công comment',
            comment
        });
    }
    catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}



export const removeComment = async (req, res) => {
    const { id } = req.params;
    try {
        await Comment.findByIdAndDelete(id);
        return res.status(200).json({
            message: 'Xóa comment thành công',
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
}
export const getAll = async (req, res) => {
    try {
        const comments = await Comment.find().populate({
            path: 'productId',
            select: 'name',
        }).populate({
            path: 'userId',
            select: 'name email image',
        });
        res.status(200).json({
            message: 'Lấy tất cả bình luận thành công',
            comments,
        });
    } catch (error) {
        res.status(400).json({
            message: error.message,
        });
    }
};