import Product from "../models/products.js";
import Category from "../models/category.js";
import { ProductSchema } from "../schemas/products.js";

export const getAll = async (req, res) => {
    const { _limit = 10, _sort = "createAt", _order = "asc", _page = 1, q } = req.query;
    const options = {
        page: _page,
        limit: _limit,
        sort: {
            [_sort]: _order == "desc" ? -1 : 1,
        },
    };

    const searchQuery = q ? { name: { $regex: q, $options: "i" } } : {};
    try {
        const data = await Product.paginate(searchQuery, options);
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const get = async (req, res) => {
    try {
        const id = req.params.id;
        const data = await Product.findById(id);
        if (data === 0) {
            return res.status(400).json({
                message: "Không có sản phẩm!",
            })
        }
        return res.status(200).json(data);
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const remove = async (req, res) => {
    try {
        const id = req.params.id;
        await Product.findByIdAndDelete(id);
        return res.status(200).json({
            message: "Xoá sản phẩm thành công",
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const addProduct = async (req, res) => {
    try {
        const body = req.body;
        const { error } = ProductSchema.validate(body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message
            })
        }
        const product = await Product.create(body);
        await Category.findOneAndUpdate(product.categoryId, {
            $addToSet: {
                products: product
            }
        })
        if (product.length === 0) {
            return res.status(400).json({
                message: "Thêm sản phẩm thất bại"
            })
        }
        return res.status(200).json({
            message: "Thêm sản phẩm thành công!",
            product
        })
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })

    }
}

export const updateProduct = async (req, res) => {
    try {
        const data = await Product.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new: true
        })
        if (!data) {
            return res.status(400).json({
                message: "Cập nhật sản phẩm thất bại"
            })
        }
        return res.status(200).json({
            message: "Cập nhật sản phẩm thành công",
            data
        })
    } catch (error) {
        return res.status(400).json({
            message: error
        })
    }
}