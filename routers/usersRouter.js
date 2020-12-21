const router = require("express").Router();
const controller = require("../controller/usersController");
const verify = require("../middleware/verify");
const authorize = require("../middleware/authorize");

router.post("/login", verify.loginVerify, controller.login, authorize);

router.post("/register", verify.registerVerify, controller.register, authorize);

router.delete("/:userId", controller.deleteUser);

router.put("/:userId", controller.updateAccount);

router.get("/", controller.getAllUser);

router.get("/:userId", controller.getUserById);

// Google and Facebook Login
router.post("/googlelogin", controller.googleController);
router.post("/facebooklogin", controller.facebookController);

module.exports = router;
