import joi from 'joi';
import Product from '../models/products';
import Brand from '../models/brands.js';

const brandSchema = joi.object({
  name: joi.string().required(),
});

export const getAll = async (req, res) => {
  try {
    const brand = await Brand.find().populate("products");
    if (brand.length === 0) {
      return res.json({
        message: 'Không có sản phẩm nào',
      });
    }
    return res.json(brand);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const get = async function (req, res) {
  try {
    
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({
        message: 'Không có sản phẩm nào',
      });
    }
    const products = await Product.find({ brandId: req.params.id });
    return res.json({ ...brand.toObject(), products });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const create = async function (req, res) {
  try {
    const { error } = brandSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const brand = await Brand.create(req.body);
    if (!brand) {
      return res.json({
        message: 'Không thêm sản phẩm',
      });
    }
    return res.json({
      message: 'Thêm sản phẩm thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const update = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!brand) {
      return res.json({
        message: 'Cập nhật sản phẩm không thành công',
      });
    }
    return res.json({
      message: 'Cập nhật sản phẩm thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const remove = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    return res.json({
      message: 'Xóa sản phẩm thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
