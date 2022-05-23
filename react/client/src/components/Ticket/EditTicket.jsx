import React, { useState } from "react"
import { useDispatch } from "react-redux"
import {
	Box,
	Button,
	TextField,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
} from "@material-ui/core"
import EditCircleRoundedIcon from "@material-ui/icons/Edit"
import { getTicket as getTicketService } from "./ticketAction"
import { updateTicketAction } from "./ticketAction"
import { useFormik } from "formik"

const EditTicket = (props) => {
	const id = props?.ticket_no
	const [open, setOpen] = React.useState(false)
	const [title, setTitle] = useState("")
	const [desc, setDesc] = useState("")

	const formik = useFormik({
		initialValues: {
			ticket_title: title,
			ticket_desc: desc,
		},
		enableReinitialize: true,
		onSubmit: (val) => {
			dispatch(updateTicketAction(id, val))
			handleClose()
		},
	})

	const dispatch = useDispatch()

	const handleClickOpen = () => {
		setOpen(true)
		getTicketService(id)
			.then((data) => {
				const { ticket_title, ticket_desc } = data.data[0]
				setTitle(ticket_title)
				setDesc(ticket_desc)
			})
			.catch((err) => console.log(err))
	}

	const handleClose = () => {
		setOpen(false)
	}

	return (
		<div>
			<EditCircleRoundedIcon
				style={{ fontSize: 25 }}
				color="action"
				onClick={handleClickOpen}
			/>
			<Dialog
				open={open}
				onClose={handleClose}
				aria-labelledby="form-dialog-title"
			>
				<DialogTitle id="form-dialog-title">Update Ticket</DialogTitle>
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
							Update Ticket
						</Button>
					</DialogActions>
				</Box>
			</Dialog>
		</div>
	)
}

export default EditTicket
