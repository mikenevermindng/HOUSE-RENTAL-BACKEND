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

// route.patch('/:accommodationPostId', controller.updateById);

route.post('/', controller.generatePostAccommodation);

// route.delete('/:accommodationPostId', checkAuth, controller.deleteById);

module.exports = route;
