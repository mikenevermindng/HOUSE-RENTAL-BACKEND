const route = require('express').Router();
const controller = require('../controller/postsController');
const multer = require('multer');

const storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './uploads');
	},
	filename: function(req, file, cb) {
		cb(null, Date.now() + file.originalname);
	}
});

const upload = multer({ storage: storage });

route.get('/', controller.index);

route.get('/:accommodationPostId', controller.getPostById);

route.post('/:accommodationPostId', controller.requestUpdatePostById);

route.post('/', controller.generateAccommodationPoster);

route.delete('/:accommodationPostId', controller.deletePostById);

module.exports = route;
