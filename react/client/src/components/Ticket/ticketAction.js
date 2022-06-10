import axios from "axios"
import { authHeader } from "../slice/authSlice"
import { addTicketSuccess, addTicketFail, fetchTicketLoading, updateTicketFail, updateTicketSuccess, fetchTicketSuccess, fetchTicketFail, deleteTicket, updateTotalRowCount } from "../slice/ticketSlice"

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

export const fetchAllTickets = (parameter) => async (dispatch) => {
	if (user) {
		dispatch(fetchTicketLoading())
		try {
			// url
			let url = "http://localhost:8080/api/ticket/getAll?"
			// limit
			if (parameter) {
				if (parameter.rowsPerPage) url += "limit=" + parameter.rowsPerPage
				// page
				if (parameter.page) url += "&page=" + (parseInt(parameter.page) + 1)
				// sort
				if (parameter.orderBy) url += "&orderBy=" + parameter.orderBy
				if (parameter.order) url += "&sort=" + parameter.order

				// filter
				if (parameter.filter) {
					const { ticket_no, ticket_title, ticket_desc, author } = parameter.filter
					if (ticket_no) url += "&ticket_no=" + ticket_no
					if (ticket_title) url += "&ticket_title=" + ticket_title
					if (ticket_desc) url += "&ticket_desc=" + ticket_desc
					if (author) url += "&author=" + author
				}
			}

			const result = await axios
				.get(url, {
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
				dispatch(updateTotalRowCount(result.totalCount))
				console.log("result", result.data)
				result.data.length && dispatch(fetchTicketSuccess(result))
			}
		} catch (error) {
			dispatch(fetchTicketFail(error.message))
		}
	} else {
		window.location.href = "/login"
	}
}

export const deleteTic = (id) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.delete(process.env.REACT_APP_API + "ticket/delete/" + id, { headers: authHeader() })
		result.data.data && dispatch(deleteTicket(result.data.data.ticket_no))
	} catch (error) {}
}

export const updateTicketAction = (id, ticket) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.put(process.env.REACT_APP_API + "ticket/update/" + id, ticket, { headers: authHeader() })
		result.data && dispatch(updateTicketSuccess(result.data.data))
	} catch (error) {
		dispatch(updateTicketFail())
	}
}

export const addTicketAction = (ticket) => async (dispatch) => {
	dispatch(fetchTicketLoading())
	try {
		const result = await axios.post(process.env.REACT_APP_API + "ticket/create", ticket, { headers: authHeader() })
		result.data.data.author = JSON.parse(window.localStorage.getItem("user"))
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
