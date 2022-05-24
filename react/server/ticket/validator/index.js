export function ticketCreateAndUpdateValidation(req, res, next) {
	req.check("ticket_title", "Ticket Title is required")
		.notEmpty()
		.isLength({
			min: 2,
			max: 50,
		})
		.withMessage("Title can't be more than 50 character")
	req.check("ticket_desc", "Ticket description is required")
		.isLength({
			min: 2,
			max: 50,
		})
		.withMessage("Title can't be more than 50 character")
		.notEmpty()
	next()
}
