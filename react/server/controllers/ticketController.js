import { ticketCreatedSuccessfully,ticketDeletedSuccessfully,ticketUpdatedSuccessfully } from "../messages/index.js"
import { createService, updateService, deleteTicketService, getByIdService, getAllService } from "../services/ticket.services.js"

export const create = async (req, res, next) => {
	try {
		req.body.authorId = req.user.payload.id
		const ticket = await createService(req.body)
		res.status(200).json({
			status: true,
			message: ticketCreatedSuccessfully,
			data: ticket,
		})
	} catch (error) {
		res.status(400).json({ error: error })
	}
}

export const update = async (req, res, next) => {
	try {
		const ticket = await updateService(req.params.id, req.body)
		res.status(200).json({
			status: true,
			message: ticketUpdatedSuccessfully,
			data: ticket,
		})
	} catch (error) {
		res.status(400).json({ error })
	}
}

export const deleteTicket = async (req, res, next) => {
	try {
		const ticket = await deleteTicketService(req.params.id)
		res.status(200).json({
			status: true,
			message: ticketDeletedSuccessfully,
			data: ticket,
		})
	} catch (error) {
		res.status(400).json({ error: error })
	}
}

export const getAll = async (req, res, next) => {
	try {
		const ticket = await getAllService()
		res.status(200).json({
			status: true,
			message: "",
			data: ticket,
		})
	} catch (error) {
		res.status(400).json({ error: error })
	}
}

export const getById = async (req, res, next) => {
	try {
		const ticket = await getByIdService(req.params.id)
		res.status(200).json({
			status: true,
			message: "",
			data: ticket,
		})
	} catch (error) {
		res.status(400).json({ error: error })
	}
}
