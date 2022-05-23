export default function userSignupValidator(req, res, next) {
	req.check("username", "User Name is required")
		.matches(/^[a-zA-Z]+$/)
		.withMessage("Only enter character in username")
	req.check("email", "Email must be between 3 to 32 characters")
		.matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("Invalid Email address format	")
		.isLength({
			min: 4,
			max: 32,
		})
	req.check("password", "Password is required").notEmpty()
	req.check("password")
		.isLength({ min: 6 })
		.withMessage("Password must contain at least 8 characters")
		.matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
		.withMessage("Password must contain a number and letter")

	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0]
		return res.status(400).json({ firstError })
	}
	next()
}

export function userSignInValidator(req, res, next) {
	req.check("email", "Email must be between 3 to 32 characters")
		.matches(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
		.withMessage("Invalid Email address format	")
		.isLength({
			min: 4,
			max: 32,
		})
	req.check("password", "Password is required").notEmpty()

	const errors = req.validationErrors()
	if (errors) {
		const firstError = errors.map((error) => error.msg)[0]
		return res.status(400).json({ firstError })
	}
	next()
}
