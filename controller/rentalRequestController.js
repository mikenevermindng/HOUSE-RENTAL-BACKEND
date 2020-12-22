const RentalRequest = require('../models/RentalRequest')

module.exports.getAllRequest = async (req, res, next) => {
    try {
        const rentalRequests = await RentalRequest.find().populate('posterId', 'city district subDistrict')
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
        const { _id } = req.userData
        const ownerId = _id
        console.log(ownerId)
        const rentalRequests = await RentalRequest.find({ ownerId: ownerId }).populate('posterId userId', 'title username phoneNumber email')
        console.log(rentalRequests)
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
        const { userData } = req
        const { _id, username, phoneNumber } = userData
        const userId = _id
        const { ownerId, posterId, numberOfPeople } = req.body
        console.log(userId)
        const requestByThisUser = await RentalRequest.findOne({ userId: userId, posterId: posterId })
        if (requestByThisUser) {
            return res.status(200).json({ message: 'Bạn đã từng đăng kí thuê bất động sản này mà chưa được phê duyệt, vui lòng xóa yêu cầu cũ đi' })
        }
        const newRequest = new RentalRequest({ userId, ownerId, username, phoneNumber, phoneNumber, posterId, numberOfPeople })
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
        console.log(rentalRequestId)
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