import user from "../models/user.js";


export const getAll = async (req, res) => {
    try {
        const data = await user.find();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const getOneById = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await user.findById(id);
        if (data === 0) {
            return res.status(400).json({
                message: "Hiện tt người dùng thất bại",
            })
        }
        const { _id, first_name,last_name,password, email, address, phone, role, avatar, createdAt } = data;

        return res.status(200).json({
            _id, first_name,last_name,password, email, address, phone, role, avatar, createdAt
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await user.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Xoá sản phẩm thành công",
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};
