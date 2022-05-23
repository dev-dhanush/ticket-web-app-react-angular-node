import { Router } from "express"
const router = Router()
import { login, registerUser, getAllUser, signout } from "../controllers/userController.js"
import auth from "../middlewares/auth.js"
import userSignupValidator, {userSignInValidator} from "../validator/index.js"

router.post("/signup", userSignupValidator, registerUser)
router.post("/signin",userSignInValidator, login)
router.get("/signout", signout)
router.get("/getAll", auth, getAllUser)

export default router
