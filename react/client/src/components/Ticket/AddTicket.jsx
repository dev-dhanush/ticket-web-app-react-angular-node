import React, { useState } from "react"
import {
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core"
import { useNavigate } from "react-router-dom"
import { addTicketAction, fetchAllTickets } from "./ticketAction"
import { useDispatch } from "react-redux"
import { useFormik } from "formik"

export default function AddTicket(props) {
	const [open, setOpen] = useState(false)

	const dispatch = useDispatch()
	let navigate = useNavigate()

	const handleClickOpen = () => {
		setOpen(true)
	}

	const handleClose = () => {
		setOpen(false)
	}

	const formik = useFormik({
		initialValues: {
			ticket_title: "",
			ticket_desc: "",
		},
		enableReinitialize: true,
		onSubmit: (val) => {
			const user = JSON.parse(localStorage.getItem("user"))
			if (user) {
				val.authorId = user.id
				dispatch(addTicketAction(val))
				dispatch(fetchAllTickets())
				navigate("/ticket")
				setOpen(false)
			} else {
				navigate("/signin")
			}
		},
	})

	return (
		<div>
			<Button
				disabled={props.error ? true : false}
				variant="outlined"
				style={{ fontSize: 15 }}
				onClick={handleClickOpen}
				color="primary"
			>
				Add Ticket
			</Button>

			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Add Ticket</DialogTitle>
				<Box component="form" onSubmit={formik.handleSubmit}>
					<DialogContent>
						<TextField
							required
							name="ticket_title"
							autoFocus
							margin="dense"
							id="ticket_title"
							label="Ticket Title"
							type="text"
							fullWidth
							value={formik.values.ticket_title}
							onChange={formik.handleChange}
							error={
								formik.touched.ticket_title &&
								Boolean(formik.errors.ticket_title)
							}
							helperText={
								formik.touched.ticket_title &&
								formik.errors.ticket_title
							}
						/>
						<TextField
							required
							name="ticket_desc"
							margin="dense"
							id="ticket_desc"
							label="Ticket Description"
							type="text"
							fullWidth
							value={formik.values.ticket_desc}
							onChange={formik.handleChange}
							error={
								formik.touched.ticket_desc &&
								Boolean(formik.errors.ticket_desc)
							}
							helperText={
								formik.touched.ticket_desc &&
								formik.errors.ticket_desc
							}
						/>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleClose} color="primary">
							Cancel
						</Button>
						<Button type="submit" color="primary">
							Add Ticket
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</div>
	)
}
