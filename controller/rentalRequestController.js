const RentalRequest = require('../models/RentalRequest')

module.exports.getAllRequest = async (req, res, next) => {
    try {
        const rentalRequests = await RentalRequest.find()
        res.status(200).json({
            requests: rentalRequests,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'error'
        })
    }
}

module.exports.getRequestToOwner = async (req, res, next) => {
    try {
        const { ownerId } = req.params
        const rentalRequests = await RentalRequest.find({ ownerId: ownerId })
        res.status(200).json({
            requests: rentalRequests,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'error'
        })
    }
}

module.exports.generateRentalRequest = async (req, res, next) => {
    try {
        const { userId } = req.body
        const requestByThisUser = await RentalRequest.findOne({ userId: userId })
        if (requestByThisUser) {
            return res.status(200).json({ message: 'Bạn đã từng đăng kí thuê bất động sản này mà chưa được phê duyệt, vui lòng xóa yêu cầu cũ đi' })
        }
        const newRequest = new RentalRequest({ ...req.body })
        const isSaved = newRequest.save()
        res.status(200).json({
            saved: isSaved,
            message: 'Bạn đã đăng kí thành công'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'Đã có lỗi xảy ra'
        })
    }
}

module.exports.deleteRentalRequest = async (req, res, next) => {
    try {
        const { rentalRequestId } = req.params
        const deleteMessage = await RentalRequest.findByIdAndDelete(rentalRequestId)
        res.status(200).json({
            deleted: deleteMessage,
            message: 'success'
        })
    } catch (error) {
        console.log(error)
        res.status(400).json({
            message: 'error'
        })
    }
}