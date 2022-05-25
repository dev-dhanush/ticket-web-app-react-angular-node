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

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1
	}
	if (b[orderBy] > a[orderBy]) {
		return 1
	}
	return 0
}
function getComparator(order, orderBy) {
	return order === "desc" ? (a, b) => descendingComparator(a, b, orderBy) : (a, b) => -descendingComparator(a, b, orderBy)
}
function stableSort(array, comparator) {
	const stabilizedThis = array.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0])
		if (order !== 0) return order
		return a[1] - b[1]
	})
	return stabilizedThis.map((el) => el[0])
}
const headCells = [
	{
		id: "ticket_no",
		numeric: false,
		disablePadding: true,
		label: "Ticket NO",
	},
	{
		id: "ticket_title",
		numeric: true,
		disablePadding: false,
		label: "Title",
	},
	{ id: "ticket_desc", numeric: true, disablePadding: false, label: "Desc" },
	{ id: "author", numeric: true, disablePadding: false, label: "Author" },
	{ id: "delete", numeric: true, disablePadding: false, label: "Delete" },
	{ id: "edit", numeric: true, disablePadding: false, label: "Edit" },
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
		minWidth: 650,
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
	const { tickets: rows } = useSelector((state) => state.ticket)
	const dispatch = useDispatch()

	const errorState = useSelector((state) => state.ticket.error)
	const [error, setError] = React.useState("")
	const logOut = useCallback(() => {
		console.log("logout called fun")
		dispatch(logout())
		window.location.href = "/login"
	}, [dispatch])

	useEffect(() => {
		if (errorState) {
			setError(errorState)
			console.log("logout called effect")
			logOut()
		}
	}, [errorState, logOut])

	useEffect(() => {
		dispatch(fetchAllTickets())
	}, [dispatch])

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
		dispatch(fetchAllTickets())
	}
	const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)

	return (
		<div className={classes.root}>
			{error && (
				<div className="alert alert-danger" role="alert">
					{" "}
					Error : {error}{" "}
				</div>
			)}
			{!error && (
				<Paper className={classes.paper}>
					<TableContainer>
						<Table className={classes.table} aria-labelledby="tableTitle" size={dense ? "small" : "medium"} aria-label="enhanced table">
							<EnhancedTableHead classes={classes} order={order} orderBy={orderBy} onRequestSort={handleRequestSort} rowCount={rows.length} />
							<TableBody>
								{stableSort(rows, getComparator(order, orderBy))
									.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
									.map((row, index) => {
										const labelId = `enhanced-table-checkbox-${index}`

										return (
											<TableRow hover role="checkbox" tabIndex={-1} key={row.ticket_no}>
												<TableCell padding="checkbox"></TableCell>
												<TableCell component="th" id={labelId} scope="row" padding="none">
													{row.ticket_no}
												</TableCell>
												<TableCell align="right">{row.ticket_title}</TableCell>
												<TableCell align="right">{row.ticket_desc}</TableCell>
												<TableCell align="right">{row.author.username}</TableCell>
												<TableCell align="right">
													<Tooltip
														onClick={() => {
															handleDelete(row.ticket_no)
														}}
														title="Delete"
													>
														<IconButton size="small" aria-label="delete">
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												</TableCell>

												<TableCell align="right">
													<Tooltip title="Update">
														<IconButton size="small" aria-label="edit">
															<EditTicket ticket_no={row.ticket_no} />
														</IconButton>
													</Tooltip>
												</TableCell>
											</TableRow>
										)
									})}
								{emptyRows > 0 && (
									<TableRow
										style={{
											height: (dense ? 13 : 53) * emptyRows,
										}}
									>
										<TableCell colSpan={6} />
									</TableRow>
								)}
							</TableBody>
						</Table>
					</TableContainer>
					<TablePagination rowsPerPageOptions={[5, 10, 25]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
				</Paper>
			)}
			<div
				style={{
					display: "flex",
					justifyContent: "space-around",
					flexDirection: "row",
				}}
			>
				<FormControlLabel control={<Switch checked={dense} onChange={handleChangeDense} />} label="Dense padding" />
				<AddTicket error={error} />
			</div>
		</div>
	)
}
