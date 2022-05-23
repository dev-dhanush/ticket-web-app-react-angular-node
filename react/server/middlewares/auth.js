import { verifyAccessToken } from "../utils/jwt.js"
import httpError from "http-errors"
const { Unauthorized } = httpError

const auth = async (req, res, next) => {
	try {
		if (!req.headers.authorization) {
			return next(Unauthorized("Access toke is required"))
		}

		const token = req.headers.authorization.split(" ")[1]

		if (!token) {
			return next(Unauthorized("Token not found"))
		}

		await verifyAccessToken(token)
			.then((user) => {
				req.user = user
				next()
			})
			.catch((e) => {
				next(Unauthorized(e.message))
			})
	} catch (e) {
		next(Unauthorized(e.message))
	}
}

export default auth
