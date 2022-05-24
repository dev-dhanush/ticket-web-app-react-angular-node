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
		const ticket = await getAllService()
		success_controller(res, true, "", ticket)
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
