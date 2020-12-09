const route = require('express').Router();
const controller = require('../controller/postsController');
var path = require('path');
var formidable = require('formidable');

const multer = require('multer');
const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		console.log(req);
		cb(null, './uploads/accoomodations');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const upload = multer({ storage: storage });
route.get('/', controller.index);

route.get('/:accommodationPostId', controller.getPostById);

route.put('/:accommodationPostId', controller.requestUpdatePostById);

route.post('/', controller.generateAccommodationPoster);

route.delete('/:accommodationPostId', controller.deletePostById);

route.post('/imageUploader', upload.single('images'), (req, res) => {
	res.status(200).json({ files: req.files });
});

route.post('/upload', function(req, res, next) {
	var form = new formidable.IncomingForm();
	form.uploadDir = path.join(__dirname + Date.now(), '../files');

	form.parse(req, function(err, fileds, files) {
		if (err) next(err);
		console.log('success');
		res.send({ status: 200, data: '', msg: 'success', files: files });
	});
});

module.exports = route;
