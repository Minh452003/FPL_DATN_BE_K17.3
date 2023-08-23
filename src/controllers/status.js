import Status from "../models/status.js";

export const getStatusList = async (req, res) => {
  try {
    const statusList = await Status.find();
    res.status(200).json(statusList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createStatus = async (req, res) => {
  try {
    const newStatus = await Status.create(req.body);

    res.status(201).json({
      message: 'Trạng thái đã được tạo thành công',
      data: newStatus,
    });
  } catch (error) {
    res.status(400).json({
      message: 'Không thể tạo trạng thái',
      error: error.message,
    });
  }
};
export const updateStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;
    const data = await Status.findByIdAndUpdate({ _id: id }, body, {
      new: true,
    });
    if (!data) {
      return res.status(404).json({
        message: 'Trạng thái không tồn tại',
      });
    }
    if (data.length === 0) {
      return res.status(400).json({
        message: "Cập nhật trạng thái thất bại",
      })
    }
    return res.status(200).json({
      message: "Cập nhật trạng thái thành công",
      data,
    })
  } catch (error) {
    return res.status(400).json({
      message: error,
    })
  }
}