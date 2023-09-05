export const authorization = async (req, res, next) => {
    try {
        const user= req.user
        if (user.role !== "admin") {
            return res.status(203).json({
                message: "Bạn không có quyền truy cập tài nguyên!"
            })
        }
        next()
    } catch (error) {
        return res.status(400).json({
            message: error.message
        })
    }
}