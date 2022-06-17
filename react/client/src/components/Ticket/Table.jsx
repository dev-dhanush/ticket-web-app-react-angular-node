import React, { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import PropTypes from "prop-types"
import { makeStyles } from "@material-ui/core/styles"
import Table from "@material-ui/core/Table"
import TableBody from "@material-ui/core/TableBody"
import TableCell from "@material-ui/core/TableCell"
import TableContainer from "@material-ui/core/TableContainer"
import TableHead from "@material-ui/core/TableHead"
import TablePagination from "@material-ui/core/TablePagination"
import TableRow from "@material-ui/core/TableRow"
import TableSortLabel from "@material-ui/core/TableSortLabel"
import Paper from "@material-ui/core/Paper"
import IconButton from "@material-ui/core/IconButton"
import Tooltip from "@material-ui/core/Tooltip"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import DeleteIcon from "@material-ui/icons/Delete"

import AddTicket from "./AddTicket"
import EditTicket from "./EditTicket"
import { deleteTic, fetchAllTickets } from "./ticketAction"
import { logout } from "../slice/authSlice"
import { Input, InputAdornment } from "@material-ui/core"
import FilterListIcon from "@material-ui/icons/FilterList"
const headCells = [
	{
		id: "ticket_no",
		numeric: false,
		disablePadding: false,
		label: "Ticket NO",
	},
	{
		id: "ticket_title",
		numeric: false,
		disablePadding: false,
		label: "Title",
	},
	{ id: "ticket_desc", numeric: false, disablePadding: false, label: "Desc" },
	{ id: "author", numeric: false, disablePadding: false, label: "Author" },
	{ id: "delete", numeric: false, disablePadding: false, label: "Delete" },
	{ id: "edit", numeric: false, disablePadding: false, label: "Edit" },
]
function EnhancedTableHead(props) {
	const { classes, order, orderBy, onRequestSort } = props
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property)
	}

	return (
		<TableHead>
			<TableRow>
				<TableCell padding="checkbox"></TableCell>
				{headCells.map((headCell) => (
					<TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"} sortDirection={orderBy === headCell.id ? order : false}>
						<TableSortLabel active={orderBy === headCell.id} direction={orderBy === headCell.id ? order : "asc"} onClick={createSortHandler(headCell.id)}>
							{headCell.label}
							{orderBy === headCell.id ? <span className={classes.visuallyHidden}>{order === "desc" ? "sorted descending" : "sorted ascending"}</span> : null}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}
EnhancedTableHead.propTypes = {
	classes: PropTypes.object.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
}
const useStyles = makeStyles((theme) => ({
	root: {
		width: "100%",
	},
	paper: {
		width: "100%",
		marginBottom: theme.spacing(2),
	},
	table: {
		minWidth: 750,
	},
	visuallyHidden: {
		border: 0,
		clip: "rect(0 0 0 0)",
		height: 1,
		margin: -1,
		overflow: "hidden",
		padding: 0,
		position: "absolute",
		top: 20,
		width: 1,
	},
}))

export default function EnhancedTable() {
	const classes = useStyles()
	const [order, setOrder] = React.useState("desc")
	const [orderBy, setOrderBy] = React.useState("ticket_no")
	const [page, setPage] = React.useState(0)
	const [dense, setDense] = React.useState(true)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const { tickets: rows, totalRowCount } = useSelector((state) => state.ticket)
	const dispatch = useDispatch()
	const currentUserId = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user"))["id"] : 0
	// filter
	const [filter, setFilter] = React.useState({
		ticket_no: "",
		ticket_desc: "",
		ticket_title: "",
		author: "",
	})

	const errorState = useSelector((state) => state.ticket.error)
	const [error, setError] = React.useState("")
	const logOut = useCallback(() => {
		dispatch(logout())
		window.location.href = "/login"
	}, [dispatch])

	useEffect(() => {
		if (errorState) {
			setError(errorState)
			logOut()
		}
	}, [errorState, logOut])

	useEffect(() => {
		dispatch(fetchAllTickets({ order, orderBy, page, rowsPerPage, filter }))
	}, [dispatch, order, orderBy, page, rowsPerPage, filter])

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc"
		setOrder(isAsc ? "desc" : "asc")
		setOrderBy(property)
	}
	const handleChangePage = (event, newPage) => {
		setPage(newPage)
	}

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10))
		setPage(0)
	}

	const handleChangeDense = (event) => {
		setDense(event.target.checked)
	}

	const handleDelete = (id) => {
		dispatch(deleteTic(id))
		dispatch(fetchAllTickets({ order, orderBy, page, rowsPerPage, filter }))
	}

	return (
		<>
			{error ? (
				<div className="alert alert-danger" role="alert">
					Error:{error}
				</div>
			) : null}
			{!error ? (
				<Paper className={classes.paper}>
					{headCells.map((headCell) =>
						["ticket_no", "ticket_title", "ticket_desc", "author"].includes(headCell.id) ? (
							<TableCell key={headCell.id} align={headCell.numeric ? "right" : "left"} padding={headCell.disablePadding ? "none" : "normal"}>
								<Input
									onKeyUp={(e) => {
										if (e.key === "Enter") {
											setFilter((prevState) => ({ ...prevState, [headCell.id]: e.target.value }))
										}
										if (e.target.value === "") {
											setFilter()
											console.log("filter", filter)
										}
									}}
									key={headCell.id}
									startAdornment={
										<InputAdornment position="start">
											<FilterListIcon />
										</InputAdornment>
									}
								/>
							</TableCell>
						) : null
					)}
					<TableContainer>
						<Table className={classes.table} aria-labelledby="tableTitle" size={dense ? "small" : "medium"} aria-label="enhanced table">
							<EnhancedTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={totalRowCount} />
							<TableBody>
								{rows.map((row, index) => {
									const labelId = `enhanced-table-checkbox-${index}`

									return (
										<TableRow hover role="checkbox" tabIndex={-1} key={row.ticket_no}>
											<TableCell padding="checkbox"></TableCell>
											<TableCell align="left" id={labelId}>
												{row.ticket_no}
											</TableCell>
											<TableCell align="left">{row.ticket_title}</TableCell>
											<TableCell align="left">{row.ticket_desc}</TableCell>
											<TableCell align="left">{row.author.username}</TableCell>
											<TableCell align="left">
												{row.authorId === currentUserId ? (
													<Tooltip
														onClick={() => {
															handleDelete(row.ticket_no)
														}}
														title="Delete"
													>
														<IconButton color="secondary" aria-label="delete">
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												) : (
													<IconButton disabled aria-label="delete">
														<DeleteIcon />
													</IconButton>
												)}
											</TableCell>

											<TableCell align="left">
												<Tooltip title="Update">
													<IconButton aria-label="edit">
														<EditTicket authorId={row.authorId} currentUserId={currentUserId} ticket_no={row.ticket_no} />
													</IconButton>
												</Tooltip>
											</TableCell>
										</TableRow>
									)
								})}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={totalRowCount} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
				</Paper>
			) : null}
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					flexDirection: "row",
				}}
			>
				<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
				<AddTicket para={{ order, orderBy, page, rowsPerPage, filter }} error={error} />
			</div>
		</>
	)
}
