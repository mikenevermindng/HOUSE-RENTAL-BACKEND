const router = require("express").Router();
const controller = require("../controller/ownerController");
const verify = require("../middleware/verify");
const authorize = require("../middleware/authorize");
const Role = require("../middleware/role");

router.post("/login", verify.loginVerify, controller.login, authorize);

router.post("/register", verify.registerVerify, controller.register, authorize);

router.delete("/:ownerId", controller.deleteOwner);

router.put("/:ownerId", controller.updateAccount);

router.get("/", controller.getAllOwner);

router.get("/:ownerId", controller.getOwnerById);

// Google and Facebook Login
router.post("/googlelogin", controller.googleController);
router.post("/facebooklogin", controller.facebookController);

module.exports = router;
