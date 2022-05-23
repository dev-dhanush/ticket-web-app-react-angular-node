import express, { json } from "express"
import cors from "cors"
import morgan from "morgan"
import expressValidator from "express-validator"
const app = express()
import userRoutes from "./routes/userRoutes.js"
import ticketRoutes from "./routes/ticketRoutes.js"

app.use(morgan("dev"))
app.use(json())
app.use(expressValidator())
app.use(cors())

app.use("/api/user", userRoutes)
app.use("/api/ticket", ticketRoutes)

app.listen(process.env.PORT||8080, () => console.log(`🚀 Server ready at: http://localhost:${process.env.PORT}`))
