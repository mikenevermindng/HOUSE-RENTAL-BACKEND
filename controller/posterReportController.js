const PosterReport = require('../models/PosterReportModel')

module.exports.getPosterReported = async (req, res, next) => {
    try {
        const listReport = await PosterReport
            .find()
            .populate('posterId', 'title status typeOfAccommodation area price pricePerMonth')
            .populate('ratingId', 'rate visits likedUser')
        res.status(200).json({ message: 'success', listReport: listReport })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'fail', listPoster: [] })
    }
}

module.exports.generatePosterReport = async (req, res, next) => {
    try {
        const { _id } = req.userData
        const userReportedId = _id
        const newReport = new PosterReport({ ...req.body, userReportedId })
        const saved = await newReport.save()
        res.status(200).json({ message: 'success', saved: saved })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'fail' })
    }
}

module.exports.deleteReport = async (req, res, next) => {
    try {
        const { reportId } = req.params
        const deleted = await PosterReport.findByIdAndDelete(reportId)
        res.status(200).json({ message: 'success', deleted: deleted })
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: 'fail' })
    }
}
