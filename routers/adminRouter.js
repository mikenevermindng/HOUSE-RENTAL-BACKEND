const route = require('express').Router()
const jwt = require('jsonwebtoken')
const { ROLE } = require('../Constants/RoleConstant')

route.post("/", (req, res, next) => {
	const { account, password } = req.body
	if (account !== process.env.ADMIN_ACCOUNT || password !== process.env.ADMIN_PASSWORD) {
		return res.status(401).json({ message: "fail to access as admin" })
	} else {
		const token = jwt.sign({ role: ROLE.ADMIN }, process.env.TOKEN_SECRET);
		return res.status(200).json({ message: "accessed as admin successfully", token: "Bearer " + token })
	}
})


module.exports = route;
