import New from "../models/news.js";
import { newSchema } from "../schemas/news.js";


export const getNews = async (req, res) => {
    try {
        const news = await New.find();
        if (news.length === 0) {
            return res.status(404).json({
                message: 'Lấy tất cả tin tức thất bại',
            });
        }
        return res.status(200).json({
            message: " Lấy tất cả tin tức thành công",
            news
        });
    } catch (error) {
        return res.status(400).json({
            message: error.message,
        });
    }
};

export const getAllDelete = async (req, res) => {
    try {
      const news = await New.findWithDeleted({ deleted: true });
      return res.status(200).json({
        message: "Lấy tất cả tin tức đã bị xóa",
        news
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      })
    }
  };

  export const getNewById = async (req, res) => {
    try {
        const id = req.params.id;
        const news = await New.findById(id);
        if (news.length === 0) {
            return res.status(400).json({
                message: "Không có dữ liệu!",
            })
        }
        return res.status(200).json({
            message: "Lấy 1 tin tức thành công",
            news
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        })
    }
};


export const removeNew = async (req, res) => {
    try {
      const id = req.params.id;
      const news = await New.deleteById(id);
      return res.status(200).json({
        message: "Xoá tin tức thành công.!",
        news
      });
    } catch (error) {
      return res.status(400).json({
        message: error,
      });
    }
  };

export const removeForceNew = async (req, res) => {
    try {
      const news = await New.deleteOne({ _id: req.params.id });
      return res.status(200).json({
        message: "Xoá sản phẩm vĩnh viễn",
        news
      })
    } catch (error) {
      return res.status(400).json({
        message: error,
      })
    }
  };


export const addNew = async (req, res) => {
    try {
        const { error } = newSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((err) => err.message),
            });
        }
        const news = await New.create(req.body);
        if (!news) {
            return res.status(400).json({
                message: 'Thêm tin tức thất bại',
            });
        }
        return res.status(200).json({
            message: 'Thêm tin tức thành công',
            news,
        });
    } catch (error) {
        return res.status(400).json({
            message: error,
        });
    }
};




export const restoreNew = async (req, res) => {
    try {
      const restoredNew = await New.restore({ _id: req.params.id }, { new: true });
      if (!restoredNew) {
        return res.status(400).json({
          message: "Tin tức không tồn tại hoặc đã được khôi phục trước đó.",
        });
      }
  
      return res.status(200).json({
        message: "Khôi phục tin tức thành công.",
        news: restoredNew,
      });
    } catch (error) {
      return res.status(400).json({
        message: error.message,
      });
    }
  };
  


export const updateNew = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const { error } = newSchema.validate(body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);
      return res.status(400).json({
        message: errors,
      });
    }
    const news = await New.findOneAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!news || news.length === 0) {
      return res.status(400).json({
        message: "Cập nhật tin tức thất bại",
      });
    }
    return res.status(200).json({
      message: "Cập nhật tin tức thành công",
      news,
    });
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};




