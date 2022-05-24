import { Router } from "express"
const router = Router()
import { create, update, deleteTicket, getAll, getById } from "../controller/ticketController.js"
import auth from "../../middlewares/auth.js"
import { ticketCreateAndUpdateValidation } from "../validator/index.js"

router.post("/create", auth,ticketCreateAndUpdateValidation, create)
router.put("/update/:id", auth,ticketCreateAndUpdateValidation, update)
router.delete("/delete/:id",auth, deleteTicket)
router.get("/getAll", auth, getAll)
router.get("/get/:id", auth, getById)

export default router
