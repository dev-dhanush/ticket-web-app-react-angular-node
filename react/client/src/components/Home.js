import React from "react"

import Ticket from "./Ticket/Table"

const Home = () => {
	return (
		<div className="container-fluid">
			<header className="jumbotron">{<Ticket />}</header>
		</div>
	)
}

export default Home
