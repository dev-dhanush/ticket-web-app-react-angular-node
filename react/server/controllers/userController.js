import { register, login, all } from "../services/auth.services.js"
import createError from "http-errors"
import {
	userCreatedSuccessfully,
	accessDenied,
	userLoginSuccessfully,
	userSignOutSuccessfully,
} from "../messages/index.js"

export async function registerUser(req, res) {
	try {
		const user = await register(req.body)
		res.status(200).json({
			status: true,
			message: userCreatedSuccessfully,
			data: user,
		})
	} catch (error) {
		if (error.code === "P2002") {
			return res
				.status(400)
				.json({ error: "User with that credentials already exists" })
		} else {
			res.status(400).json({ error: error })
		}
	}
}

const _login = async (req, res) => {
	try {
		const data = await login(req.body)
		res.status(200).json({
			status: true,
			message: userLoginSuccessfully,
			data,
		})
	} catch (error) {
		res.status(400).json({ error: error.message })
	}
}
export { _login as login }

export async function getAllUser(req, res, next) {
	try {
		const user = await all()
		res.status(200).json({
			status: true,
			message: "",
			data: user,
		})
	} catch (error) {
		res.status(400).json({ error: error })
	}
}

export async function signout(req, res, next) {
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
