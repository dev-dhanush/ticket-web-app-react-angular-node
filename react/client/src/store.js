import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./components/slice/authSlice"
import messageReducer from "./components/slice/messageSlice"
import ticketReducer from "./components/slice/ticketSlice"

const reducer = {
	auth: authReducer,
	message: messageReducer,
	ticket: ticketReducer,
}

const store = configureStore({
	reducer: reducer,
	devTools: true,
})

export default store
