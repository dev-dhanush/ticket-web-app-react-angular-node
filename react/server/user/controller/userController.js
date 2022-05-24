import { register, all, signin } from "../service/index.js"
import { userCreatedSuccessfully, accessDenied, userLoginSuccessfully, userSignOutSuccessfully } from "../../messages/index.js"
import { error_controller, success_controller } from "../../helpers/success_error.js"

export async function registerUser(req, res) {
	try {
		const user = await register(req.body)
		success_controller(res, true, userCreatedSuccessfully, user)
	} catch (error) {
		if (error.code === "P2002") {
			return error_controller(res, "User with that credentials already exists")
		} else {
			return error_controller(res, error)
		}
	}
}

export const login = async (req, res) => {
	try {
		const data = await signin(req.body)
		success_controller(res, true, userLoginSuccessfully, data)
	} catch (error) {
		return error_controller(res, error.message)
	}
}

export async function getAllUser(req, res) {
	try {
		const user = await all()
		success_controller(res, true, "", user)
	} catch (error) {
		return error_controller(res, error)
	}
}

export async function signout(req, res) {
	try {
		res.clearCookie()
		res.json({ message: userSignOutSuccessfully })
	} catch (error) {}
}

export function isAuth(req, res, next) {
	let user = req.profile && req.auth && req.profile._id == req.auth._id
	if (!user) {
		return res.status(403).json({
			error: accessDenied,
		})
	}
	next()
}
