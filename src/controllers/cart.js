import Cart from "../models/cart.js";
import { cartSchema } from "../schemas/cart.js";

export const getAll = async (req, res) => {
  const {
    _limit = 10,
    _sort = "createAt",
    _order = "asc",
    _page = 1,
    q,
  } = req.query;
  const options = {
    page: _page,
    limit: _limit,
    sort: {
      [_sort]: _order == "desc" ? -1 : 1,
    },
  };

  const searchQuery = q ? { name: { $regex: q, $options: "i" } } : {};
  try {
    const data = await Cart.paginate(searchQuery, options);
    if (data === 0) {
      return res.status(400).json({
        message: "Giỏ hàng trống!",
      });
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const getById = async (req, res) => {
  try {
    const data = await Cart.findById(req.params.id);
    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy giỏ hàng",
      });
    }
    return res.json({ message: "lấy giỏ hàng thành công", data });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const remove = async (req, res) => {
  try {
    const id = req.params.id;

    await Cart.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xoá giỏ hàng thành công!",
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};

export const add = async (req, res) => {
  try {
    const body = req.body;
    const { error } = cartSchema.validate(body, { abortEarly: false });
    if (error) {
      return res.status(400).json({
        message: error.details[0].message,
      });
    }
    const cart = await Cart.create(body);

    if (cart.length === 0) {
      return res.status(400).json({
        message: "Thêm cart thất bại",
      });
    }
    return res.status(200).json({
      message: "Thêm cart thành công!",
      product,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};
