
import Product from '../models/products.js';
import Brand from '../models/brands.js';
import { BrandSchema } from '../schemas/brands.js';

export const getAllBrands = async (req, res) => {
  try {
    const brand = await Brand.find();
    if (brand.length === 0) {
      return res.json({
        message: 'Không có thương hiệu nào',
      });
    }
    return res.json(brand);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
export const getBrand = async function (req, res) {
  try {

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({
        message: 'Không có thương hiệu nào',

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
export const createBrand = async function (req, res) {
  try {
    const { error } = BrandSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const brand = await Brand.create(req.body);
    if (!brand) {
      return res.json({
        message: 'Không thêm thương hiệu',
      });
    }
    return res.json({
      message: 'Thêm thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const updateBrand = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!brand) {
      return res.json({
        message: 'Cập nhật thương hiệu không thành công',
      });
    }
    return res.json({
      message: 'Cập nhật thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
export const removeBrand = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    return res.json({
      message: 'Xóa thương hiệu thành công',
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
