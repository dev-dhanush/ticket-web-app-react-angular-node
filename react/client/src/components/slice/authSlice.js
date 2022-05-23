import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { setMessage } from "../slice/messageSlice"

import AuthService from "../auth/auth.service"

const user = JSON.parse(localStorage.getItem("user"))

export const authHeader = () => {
	const user = JSON.parse(localStorage.getItem("user"))

	if (user && user.accessToken) {
		return { Authorization: "Bearer " + user.accessToken }
	} else {
		return {}
	}
}

export const register = createAsyncThunk(
	"auth/register",
	({ username, email, password }, thunkAPI) => {
		AuthService.register(username, email, password).then((data) => {
			if (data.data) {
				thunkAPI.dispatch(setMessage(data.data.message))
				return data.data
			} else {
				thunkAPI.dispatch(setMessage(data[Object.keys(data)[0]]))
				return thunkAPI.rejectWithValue()
			}
		})
	}
)

export const login = createAsyncThunk(
	"auth/login",
	async ({ email, password }, thunkAPI) => {
		try {
			const data = await AuthService.login(email, password)
			console.log("data authSlice", data)
			return data
		} catch (error) {
			thunkAPI.dispatch(setMessage(error.toString()))
			console.log("thunkAPI rejectwith Value", thunkAPI.rejectWithValue)
			return thunkAPI.rejectWithValue()
		}
	}
)

export const logout = createAsyncThunk("auth/logout", () => {
	return AuthService.logout()
})

const initialState = user
	? { isLoggedIn: true, user }
	: { isLoggedIn: false, user: null }

const authSlice = createSlice({
	name: "auth",
	initialState,
	reducers: {
		login_fulfilled: (state, action) => {
			state.isLoggedIn = true
			console.log("action payload slice =>",action.payload)
			state.user = action.payload
		},
		login_rejected: (state, action) => {
			state.isLoggedIn = false
			state.user = null
		},
		logout_fulfilled: (state, action) => {
			state.isLoggedIn = false
			state.user = null
		},
	},
})

const { reducer, actions } = authSlice
export const { logout_fulfilled, login_rejected, login_fulfilled } = actions
export default reducer
