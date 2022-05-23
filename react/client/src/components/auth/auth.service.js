import axios from "axios"

const register = async (username, email, password) => {
	try {
		return await axios.post(process.env.REACT_APP_API + "user/signup", {
			username,
			email,
			password,
		})
	} catch (error) {
		return error.response.data
	}
}

const login = async (email, password) => {
	try {
		const response = await axios.post(
			process.env.REACT_APP_API + "user/signin",
			{
				email,
				password,
			}
		)
		console.log("respponse data  auth servie => ",response.data);
		if (response.data.data.accessToken) {
			localStorage.setItem("user", JSON.stringify(response.data.data))
		}
		return response.data
	} catch (error) {
		console.log("error Authservice => ",error.response.data)
		return error.response.data
	}
}

const logout = () => {
	localStorage.removeItem("user")
}

const isAuthenticated = () => {
	if (typeof window == "undefined") {
		return false
	}
	if (localStorage.getItem("jwt")) {
		return JSON.parse(localStorage.getItem("jwt"))
	} else {
		return false
	}
}

const authService = {
	register,
	login,
	logout,
	isAuthenticated,
}

export default authService
