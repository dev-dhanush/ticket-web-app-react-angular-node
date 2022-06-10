import express, { json } from "express"
import cors from "cors"
import morgan from "morgan"
import expressValidator from "express-validator"
const app = express()
import userRoutes from "./user/routes/index.js"
import ticketRoutes from "./ticket/routes/index.js"

app.use(morgan("dev"))
app.use(json())
app.use(expressValidator())
app.use(cors())

app.use("/api/user", userRoutes)
app.use("/api/ticket", ticketRoutes)

// process.on("unhandledRejection", (reason, promise) => {
// 	console.error(reason)
// 	throw reason
// })

// process.on("uncaughtException", (error) => {
// 	console.error(error)
// 	errorManagement.handler.handleError(error)
// 	if (errorManagement.handler.isTrustedError(error)) process.exit(1)
// })

app.listen(process.env.PORT || 8080, () => console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`))
