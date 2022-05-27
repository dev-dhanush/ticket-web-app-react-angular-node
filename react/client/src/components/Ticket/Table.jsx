import React from "react"
import MaterialTable from "material-table"

// Import Material Icons
import { forwardRef } from "react"
import AddBox from "@material-ui/icons/AddBox"
import ArrowDownward from "@material-ui/icons/ArrowDownward"
import Check from "@material-ui/icons/Check"
import ChevronLeft from "@material-ui/icons/ChevronLeft"
import ChevronRight from "@material-ui/icons/ChevronRight"
import Clear from "@material-ui/icons/Clear"
import DeleteOutline from "@material-ui/icons/DeleteOutline"
import Edit from "@material-ui/icons/Edit"
import FilterList from "@material-ui/icons/FilterList"
import FirstPage from "@material-ui/icons/FirstPage"
import LastPage from "@material-ui/icons/LastPage"
import Remove from "@material-ui/icons/Remove"
import SaveAlt from "@material-ui/icons/SaveAlt"
import Search from "@material-ui/icons/Search"
import ViewColumn from "@material-ui/icons/ViewColumn"
import axios from "axios"
import { authHeader } from "../slice/authSlice"
import { useDispatch } from "react-redux"
import { addTicketAction, deleteTic, updateTicketAction } from "./ticketAction"
const tableIcons = {
	Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
	Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
	Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
	DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
	Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
	Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
	FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
	LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
	NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
	PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref} />),
	ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
	Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
	SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
	ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
	ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
}

const App = () => {
	// render() {
	const dispatch = useDispatch()
	// Material Table Columns
	const columns = [
		{ title: "Id", field: "ticket_no", editable: "never" },
		{ title: "Title", field: "ticket_title", validate: (rowData) => rowData.ticket_title !== "" && !(rowData.ticket_title.length >= 50) },
		{ title: "Desc", field: "ticket_desc", validate: (rowData) => rowData.ticket_desc !== "" && !(rowData.ticket_desc.length >= 50) },
		{ title: "Author", field: "author.username", editable: "never", filtering: false },
	]
	const data = (query) =>
		new Promise((resolve, reject) => {
			let page = parseInt(query.page) + 1

			// url
			let url = "http://localhost:8080/api/ticket/getAll?"
			// limit
			url += "limit=" + query.pageSize
			// page
			url += "&page=" + page
			// sort
			if (query.orderBy) url += "&orderBy=" + query.orderBy.field
			if (query.orderDirection) url += "&sort=" + query.orderDirection
			// filter
			if (query.filters.length) {
				const filter = query.filters.map((filter) => {
					return `&${filter.column.field}${filter.operator}${filter.value}`
				})
				url += filter.join("")
			}

			axios(url, { headers: authHeader() }).then((result) => {
				resolve({
					data: result.data.paginateData,
					page: query.page,
					totalCount: result.data.totalCount,
				})
			})
		})

	const tableRef = React.createRef()

	return (
		<div className="App wrapper">
			<MaterialTable
				title="Ticket Title"
				tableRef={tableRef}
				icons={tableIcons}
				columns={columns}
				data={data}
				editable={{
					onRowAdd: (newData) =>
						new Promise((resolve, reject) => {
							dispatch(addTicketAction(newData))
							resolve()
						}),
					onRowUpdate: (newData, oldData) =>
						new Promise((resolve, reject) => {
							newData = (({ ticket_title, ticket_desc }) => ({ ticket_title, ticket_desc }))(newData)
							dispatch(updateTicketAction(oldData.ticket_no, newData))
							resolve()
						}),
					onRowDelete: (oldData) =>
						new Promise((resolve, reject) => {
							dispatch(deleteTic(oldData.ticket_no))
							resolve()
						}),
				}}
				options={{
					filtering: true,
					search: false,
					sorting: true,
				}}
			/>
		</div>
	)
}
export default App
