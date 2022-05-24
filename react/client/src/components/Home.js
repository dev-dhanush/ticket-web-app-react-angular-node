import React from "react"

import AllTickets from "../components/Ticket/AllTicket"

const Home = () => {
	return (
		<div className="container-fluid">
			<header className="jumbotron">{<AllTickets />}</header>
		</div>
	)
}

export default Home
