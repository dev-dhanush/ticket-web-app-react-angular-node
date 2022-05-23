import jwt from "jsonwebtoken"
const { sign, verify } = jwt

import httpError from "http-errors"
const { InternalServerError, Unauthorized } = httpError

import "dotenv/config"

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET

export function signAccessToken(payload) {
	return new Promise((resolve, reject) => {
		sign({ payload }, accessTokenSecret, {}, (err, token) => {
			if (err) {
				reject(InternalServerError())
			}
			resolve(token)
		})
	})
}
export function verifyAccessToken(token) {
	return new Promise((resolve, reject) => {
		verify(token, accessTokenSecret, (err, payload) => {
			if (err) {
				const message = err.name == "JsonWebTokenError" ? "Unauthorized" : err.message
				return reject(Unauthorized(message))
			}
			resolve(payload)
		})
	})
}
