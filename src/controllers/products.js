import Product from "../models/products.js";
import Category from "../models/category.js";
import { ProductSchema } from "../schemas/products.js";
import Color from "../models/colors.js";

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
        const product = await Product.paginate(searchQuery, options);
        return res.status(200).json({
            message: "Lấy tất cả sản phẩm thành công",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const getAllDelete = async (req, res) => {
    try {
        const product = await Product.findWithDeleted({ deleted: true });

        return res.status(200).json({
            message: "Lấy tất cả sản phẩm đã bị xóa",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const restoreProduct = async (req, res) => {
    try {
        const restoredProduct = await Product.restore({ _id: req.params.id }, { new: true });
        if (!restoredProduct) {
            return res.status(400).json({
                message: "Sản phẩm không tồn tại hoặc đã được khôi phục trước đó.",
            });
        }

        return res.status(200).json({
            message: "Khôi phục sản phẩm thành công.",
            product: restoredProduct,
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const get = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await Product.findById(id);
        if (product.length === 0) {
            return res.status(400).json({
                message: "Không có sản phẩm!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 sản phẩm thành công",
            product
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
        const product = await Product.findById(id);
        console.log(product);
        if (product) {
            await product.delete()
        }
        return res.status(200).json({
            message: "Xoá sản phẩm thành công.chuyển sang thùng rác",
            product
        })
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};

export const removeForce = async (req, res) => {
    try {
        const product = await Product.deleteOne({ _id: req.params.id });
        return res.status(200).json({
            message: "Xoá sản phẩm vĩnh viễn",
            product
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
        const { error } = ProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        const product = await Product.create(body);
        await Category.findOneAndUpdate(product.categoryId, {
            $addToSet: {
                products: product._id,
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
        const id = req.params.id;
        const body = req.body;
        const { categoryId } = req.body
        const product = await Product.findById(id)
        const { error } = ProductSchema.validate(body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((err) => err.message);
            return res.status(400).json({
                message: errors
            })
        }
        await Category.findByIdAndUpdate(product.categoryId, {
            $pull: {
                products: product._id
            }
        })
        await Category.findByIdAndUpdate(categoryId, {
            $addToSet: {
                products: product._id
            }
        })
        const data = await Product.findByIdAndUpdate({ _id: id }, body, { new: true })
        if (data.length === 0) {
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
// 
export const updateProductPrice = async (req, res) => {
    try {
        const id = req.params.id;
        const selectedColor = req.body.colorId; // Màu đã chọn từ phía frontend
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({
                message: "Không tìm thấy sản phẩm!",
            });
        }

        // Tìm giá của màu đã chọn trong bảng colors
        const color = await Color.findById(selectedColor);
        if (!color) {
            return res.status(400).json({
                message: "Màu không hợp lệ!",
            });
        }

        // Lấy giá sản phẩm hiện tại từ trường product_price
        const currentProductPrice = product.product_price;

        // Cập nhật giá sản phẩm dựa trên giá của màu đã chọn
        const updatedProductPrice = currentProductPrice + color.colors_price;
        product.colorId = selectedColor;
        product.product_price = updatedProductPrice;
        await product.save();

        return res.status(200).json({
            message: "Cập nhật giá sản phẩm thành công",
            product
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};