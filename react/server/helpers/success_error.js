export const success_controller = (res, status, message, data) => {
	res.status(200).json({
		status: status,
		message: message,
		data: data,
	})
}

export const error_controller = (res, error) => {
	return res.status(400).json({ error: error })
}
