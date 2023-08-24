<<<<<<< HEAD
import Comment from "../model/comments.js";
import { CommentSchema } from "../schemas/comments.js";
=======
import Comment from "../models/comments.js";
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521


export const getCommentFromProduct = async (req, res) => {
    const { productId } = req.params;
    try {
        const comments = await Comment.find({ productId: productId }).populate({
            path: 'userId',
            select: 'name email image',
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

<<<<<<< HEAD
    const { productId, description, userId } = req.body;
=======
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
    try {
        const comment = await Comment.create(req.body);
        return res.status(200).json({
            message: "Tạo comment thành công",
            comment,
        });
    } catch (error) {
        res.status(400).json({
            message: error,
        });
    }
}


<<<<<<< HEAD
=======
// Cập nhập nội dung của bình luận
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
export const updateComment = async (req, res) => {
    const { id } = req.params;
    const { description } = req.body;

    try {
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


<<<<<<< HEAD
=======
// Xóa một bình luận
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
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
<<<<<<< HEAD

=======
//  Get all tất cả bình luận
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
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