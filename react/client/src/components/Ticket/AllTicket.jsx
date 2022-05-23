import React, { useEffect } from "react"
import { useDispatch } from "react-redux"
import { fetchAllTickets } from "./ticketAction"
import EnhancedTable from "./Table"

const AllTickets = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		dispatch(fetchAllTickets())
	}, [dispatch])

	return <EnhancedTable />
}

export default AllTickets
