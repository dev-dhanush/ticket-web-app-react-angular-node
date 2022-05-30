import { ticketCreatedSuccessfully, ticketDeletedSuccessfully, ticketUpdatedSuccessfully } from "../../messages/index.js"
import { createService, updateService, deleteTicketService, getByIdService, getAllService } from "../service/index.js"
import { success_controller, error_controller } from "../../helpers/success_error.js"
import client from "@prisma/client"
const { PrismaClient } = client
const prisma = new PrismaClient({ rejectOnNotFound: true })

export const create = async (req, res) => {
	try {
		req.body.authorId = req.user.payload.id
		const ticket = await createService(req.body)
		success_controller(res, true, ticketCreatedSuccessfully, ticket)
	} catch (error) {
		error_controller(res, error)
	}
}

export const update = async (req, res) => {
	try {
		const ticket = await updateService(req.params.id, req.body)
		success_controller(res, true, ticketUpdatedSuccessfully, ticket)
	} catch (error) {
		error_controller(res, error)
	}
}

export const deleteTicket = async (req, res) => {
	try {
		const ticket = await deleteTicketService(req.params.id)
		success_controller(res, true, ticketDeletedSuccessfully, ticket)
	} catch (error) {
		error_controller(res, error)
	}
}

export const getAll = async (req, res) => {
	try {
		const query = req.query
		const page = parseInt(query.page) || 1
		const limit = parseInt(query.limit) || 2
		// const last_page = req.query.last_page
		const startIndex = (page - 1) * limit
		// const endIndex = page * limit
		const result = {}
		const totalCount = await prisma.ticket.count({
			where: {
				isDeleted: false,
			},
		})
		const totalPage = Math.ceil(totalCount / limit)
		const currentPage = page || 0

		// sort
		const orderBy = query.orderBy ? query.orderBy : "ticket_no"
		const sort = query.sort === "asc" ? "asc" : "desc"
		const order = {}
		if (orderBy === "author.username") {
			order["author"] = { username: sort }
		} else {
			order[orderBy] = sort
		}

		// filter
		const where = { isDeleted: false }
		if (query.ticket_no) where["ticket_no"] = { equals: parseInt(query.ticket_no) }
		if (query.ticket_title) where["ticket_title"] = { startsWith: query.ticket_title }
		if (query.ticket_desc) where["ticket_desc"] = { startsWith: query.ticket_desc }

		try {
			if (page < 0) {
				return res.status(400).json("Page value should not be negative")
			} else if (page && limit) {
				result.totalCount = totalCount
				result.totalPage = totalPage
				result.currentPage = currentPage
				result.next = {
					page: page + 1,
					limit: limit,
				}
				result.paginateData = await prisma.ticket.findMany({
					take: limit,
					skip: startIndex,
					where: where,
					select: {
						ticket_desc: true,
						author: {
							select: { username: true },
						},
						ticket_no: true,
						ticket_title: true,
						authorId: true,
					},
					orderBy: [order],
				})
				res.paginatedResult = result
				result.currentCountPerPage = Object.keys(result.paginateData).length
				result.range = currentPage * limit
				return res.status(200).json(result)
			} else {
				return res.status(404).json({ error: "Resource not found" })
			}
		} catch (err) {
			console.error("error", err)
			return res.status(500).json(err)
		}
	} catch (error) {
		error_controller(res, error)
	}
}

export const getById = async (req, res) => {
	try {
		const ticket = await getByIdService(req.params.id)
		success_controller(res, true, "", ticket)
	} catch (error) {
		error_controller(res, error)
	}
}
