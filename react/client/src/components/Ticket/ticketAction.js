import axios from "axios"
import { authHeader } from "../slice/authSlice"
import {
	addTicketSuccess,
	addTicketFail,
	fetchTicketLoading,
	updateTicketFail,
	updateTicketSuccess,
	fetchTicketSuccess,
	fetchTicketFail,
	deleteTicket,
} from "../slice/ticketSlice"

const user = localStorage.getItem("user")

export const getTicket = async (id) => {
	id = id || ""
	return await axios
		.get(`${process.env.REACT_APP_API}ticket/get/${id}`, { headers: authHeader() })
		.then((res) => {
			return res.data
		})
		.catch((err) => {
			return err
		})
}

export const fetchAllTickets = () => async (dispatch) => {
	if (user) {
		dispatch(fetchTicketLoading())
		try {
			const result = await axios
				.get(`${process.env.REACT_APP_API}ticket/getAll`, {
					headers: authHeader(),
				})
				.then((res) => {
					return res.data
				})
				.catch((err) => {
					return err
				})
			if (result.data === undefined && result.isAxiosError) {
				return dispatch(fetchTicketFail(result.response.statusText))
			} else {
				result.data.length && dispatch(fetchTicketSuccess(result.data))
			}
		} catch (error) {
			console.log("error", error)
			dispatch(fetchTicketFail(error.message))
		}
	} else {
		window.location.href = "/login"
	}
}

export const deleteTic = (id) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.delete(
			process.env.REACT_APP_API + "ticket/delete/" + id,
			{ headers: authHeader() }
		)
		result.data.data && dispatch(deleteTicket(result.data.data.ticket_no))
	} catch (error) {}
}

export const updateTicketAction = (id, ticket) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.put(
			process.env.REACT_APP_API + "ticket/update/" + id,
			ticket,
			{ headers: authHeader() }
		)
		result.data && dispatch(updateTicketSuccess(result.data.data))
	} catch (error) {
		dispatch(updateTicketFail())
	}
}

export const addTicketAction = (ticket) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.post(
			process.env.REACT_APP_API + "ticket/create",
			ticket,
			{ headers: authHeader() }
		)
		result.data.data.author = JSON.parse(
			window.localStorage.getItem("user")
		)
		delete result.data.data.author.delete_at
		delete result.data.data.author.created_at
		delete result.data.data.author.updated_at
		delete result.data.data.author.isDeleted
		delete result.data.data.author.accessToken
		delete result.data.data.author.authorId

		result.data && dispatch(addTicketSuccess(result.data.data))
	} catch (error) {
		dispatch(addTicketFail(error))
	}
}
