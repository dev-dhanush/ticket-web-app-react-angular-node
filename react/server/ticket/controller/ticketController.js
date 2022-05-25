import { ticketCreatedSuccessfully, ticketDeletedSuccessfully, ticketUpdatedSuccessfully } from "../../messages/index.js"
import { createService, updateService, deleteTicketService, getByIdService, getAllService } from "../service/index.js"
import { success_controller, error_controller } from "../../helpers/success_error.js"

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
		let { page, size, sort } = req.query
		!page ? (page = 1) : parseInt(page)
		!size ? (size = 10) : parseInt(size)
		sort === "asc" ? (sort = "asc") : (sort = "desc")
		
		const ticket = await getAllService({ page, size, sort })
		success_controller(res, true, "", ticket)
	} catch (error) {
		error_controller(res, error)
	}

	// /** new */
	// try {
	// 	let { page, size, sort } = req.query

	// 	if (!page) {
	// 		page = 1
	// 	}
	// 	if (!size) {
	// 		size = 10
	// 	}
	// 	const limit = parseInt(size)
	// 	const user = await User.find().sort({ votes: 1, _id: 1 }).limit(limit)
	// 	res.send({
	// 		page,
	// 		size,
	// 		Info: user,
	// 	})
	// } catch (error) {
	// 	res.sendStatus(500)
	// }
	// /** new end */
}

export const getById = async (req, res) => {
	try {
		const ticket = await getByIdService(req.params.id)
		success_controller(res, true, "", ticket)
	} catch (error) {
		error_controller(res, error)
	}
}
