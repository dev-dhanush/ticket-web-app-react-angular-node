import Client from '@prisma/client';
const { PrismaClient } = Client
const prisma = new PrismaClient({ rejectOnNotFound: true })

import httpError from "http-errors"
const { NotFound, Unauthorized } = httpError

import "dotenv/config"

import bcryptjs from 'bcryptjs';
const { hashSync, compareSync } = bcryptjs;

import { signAccessToken } from "../utils/jwt.js"

export async function register(data) {
	data.password = hashSync(data.password, 8)
	let user = await prisma.user.create({
		data: data,
	})

	data.accessToken = await signAccessToken(user)

	return data
}

export async function login(data) {
	const { email, password } = data
	console.log(data)
	const user = await prisma.user.findUnique({
		where: {
			email: email,
		},
	})
	if (!user) {
		throw NotFound("User not registered")
	}
	const checkPassword = compareSync(password, user.password)
	if (!checkPassword) throw Unauthorized("Email address or password not valid")
	delete user.password
	const accessToken = await signAccessToken(user)
	return { ...user, accessToken }
}

export async function all() {
	const allUsers = await prisma.user.findMany()
	return allUsers
}
