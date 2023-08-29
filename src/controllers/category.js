import { categorySchema } from "../schemas/category.js";
import Category from "../models/category.js";

export const getAllCategory = async (req, res) => {
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
    const data = await Category.paginate(searchQuery, options);
    if (data === 0) {
      return res.status(400).json({
        message: "Không có danh mục!",
      })
    }
    return res.status(200).json(data);
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

export const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({ message: "lấy danh mục thành công", category });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const RemoveCategory = async (req, res) => {
  try {
    const id = req.params.id;

    // Xóa danh mục
    await Category.findByIdAndDelete(id);

    return res.status(200).json({
      message: "Xoá Danh mục thành công!",
    })
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
};

export const addCategory = async (req, res) => {
  const { category_name } = req.body;
  const formData = req.body;
  try {
    const data = await Category.findOne({ category_name });
    if (data) {
      return res.status(400).json({
        message: "danh mục đã tồn tại",
      });
    }
    // validate
    const { error } = categorySchema.validate(formData, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors
      })
    }
    const category = await Category.create(formData);
    if (!category || category.length === 0) {
      return res.status(400).json({
        message: "không tìm thấy danh mục",
      });
    }
    return res.json({
      message: "Thêm danh mục thành công",
      category,
    });
  } catch (error) {
    return res.status(400).json({
      message: error,
    });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = categorySchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors
      })
    }
    const data = await Category.findOneAndUpdate({ _id: id }, body, { new: true })
    if (!data || data.length === 0) {
      return res.status(400).json({
        message: "Cập nhật danh mục thất bại"
      })
    }
    return res.status(200).json({
      message: "Cập nhật danh mục thành công",
      data
    })
  } catch (error) {
    return res.status(400).json({
      message: error.message
    })
  }
}