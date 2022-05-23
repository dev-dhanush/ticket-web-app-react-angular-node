import { Router } from "express"
const router = Router()
import { create, update, deleteTicket, getAll, getById } from "../controllers/ticketController.js"
import auth from "../middlewares/auth.js"

router.post("/create", auth, create)
router.put("/update/:id", auth, update)
router.delete("/delete/:id", deleteTicket)
router.get("/getAll", auth, getAll)
router.get("/get/:id", auth, getById)

export default router
