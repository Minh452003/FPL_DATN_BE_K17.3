<<<<<<< HEAD
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
=======
import Product from '../models/products.js';
import Brand from '../models/brands.js';
import { BrandSchema } from '../schemas/brands.js';

export const getAllBrands = async (req, res) => {
  try {
    const brand = await Brand.find();
    if (brand.length === 0) {
      return res.json({
        message: 'Không có thương hiệu nào',
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
      });
    }
    return res.json(brand);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
<<<<<<< HEAD
export const get = async function (req, res) {
  try {
    
    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({
        message: 'Không có sản phẩm nào',
=======
export const getBrand = async function (req, res) {
  try {

    const brand = await Brand.findById(req.params.id);
    if (!brand) {
      return res.json({
        message: 'Không có thương hiệu nào',
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
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
<<<<<<< HEAD
export const create = async function (req, res) {
  try {
    const { error } = brandSchema.validate(req.body);
=======
export const createBrand = async function (req, res) {
  try {
    const { error } = BrandSchema.validate(req.body);
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
    if (error) {
      return res.status(400).json({
        message: error.details.map((err) => err.message),
      });
    }
    const brand = await Brand.create(req.body);
    if (!brand) {
      return res.json({
<<<<<<< HEAD
        message: 'Không thêm sản phẩm',
      });
    }
    return res.json({
      message: 'Thêm sản phẩm thành công',
=======
        message: 'Không thêm thương hiệu',
      });
    }
    return res.json({
      message: 'Thêm thương hiệu thành công',
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
<<<<<<< HEAD
export const update = async function (req, res) {
=======
export const updateBrand = async function (req, res) {
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
  try {
    const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!brand) {
      return res.json({
<<<<<<< HEAD
        message: 'Cập nhật sản phẩm không thành công',
      });
    }
    return res.json({
      message: 'Cập nhật sản phẩm thành công',
=======
        message: 'Cập nhật thương hiệu không thành công',
      });
    }
    return res.json({
      message: 'Cập nhật thương hiệu thành công',
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
<<<<<<< HEAD
export const remove = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    return res.json({
      message: 'Xóa sản phẩm thành công',
=======
export const removeBrand = async function (req, res) {
  try {
    const brand = await Brand.findByIdAndDelete(req.params.id);
    return res.json({
      message: 'Xóa thương hiệu thành công',
>>>>>>> 46e6021749313ec9bd2172cd1ee9da2a7043d521
      brand,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};
