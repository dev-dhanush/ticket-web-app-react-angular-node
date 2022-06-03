import React, { useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	Route,
	Link,
	Routes,
	BrowserRouter,
} from "react-router-dom"

import "bootstrap/dist/css/bootstrap.min.css"
import "./App.css"

import Login from "./components/auth/Login"
import Register from "./components/auth/Register"
import Home from "./components/Home"

import { logout } from "./components/slice/authSlice"

const App = () => {
	const { user: currentUser } = useSelector((state) => state.auth)
	const dispatch = useDispatch()

	const logOut = useCallback(() => {
		dispatch(logout())
	}, [dispatch])

	return (
		<BrowserRouter>
			<div>
				<nav className="navbar navbar-expand navbar-dark bg-dark">
					<Link to={"/"} className="navbar-brand">
						Ticket APP
					</Link>
					<div className="navbar-nav mr-auto">
						<li className="nav-item">
							<Link to={"/"} className="nav-link">
								Tickets
							</Link>
						</li>
					</div>

					{currentUser ? (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<a
									href="/login"
									className="nav-link"
									onClick={logOut}
								>
									LogOut
								</a>
							</li>
						</div>
					) : (
						<div className="navbar-nav ml-auto">
							<li className="nav-item">
								<Link to={"/login"} className="nav-link">
									Login
								</Link>
							</li>

							<li className="nav-item">
								<Link to={"/register"} className="nav-link">
									Sign Up
								</Link>
							</li>
						</div>
					)}
				</nav>

				<div>
					<Routes>
						<Route exact path="/" element={<Home/>} />
						<Route exact path="/ticket" element={<Home/>} />
						<Route exact path="/login" element={<Login/>} />
						<Route exact path="/register" element={<Register/>} />
					</Routes>
				</div>
			</div>
		</BrowserRouter>
	)
}

export default App
