import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { MatSort, Sort } from '@angular/material/sort';
import { TicketService } from '../../_services/ticket.service';
import { Ticket } from '../../model/ticket.model';
import { MatDialog } from '@angular/material/dialog';
import { CreateTicketComponent } from '../create-ticket/create-ticket.component';
import { UpdateTicketComponent } from '../update-ticket/update-ticket.component';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css'],
})
export class TicketsComponent implements OnInit {
  displayedColumns: string[] = [
    'ticket_no',
    'ticket_title',
    'ticket_desc',
    'author',
    'edit',
    'delete',
  ];
  dataSource = new MatTableDataSource<Ticket>();
  public ticket: Array<Object>;

  currentUser = JSON.parse(localStorage.getItem('auth-user')!);

  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private ticketService: TicketService,
    public dialog: MatDialog
  ) {
    this.fetchTicket();
  }

  handleEdit = (title: String, desc: String, id: Number) => {
    this.dialog.open(UpdateTicketComponent, {
      data: {
        ticket_title: title,
        ticket_desc: desc,
        editId: id,
      },
    });
  };

  openDialog() {
    this.dialog.open(CreateTicketComponent, {
      data: {
        edit: false,
      },
    });
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngOnInit(): void {
    this.fetchTicket();
  }

  handleDelete = (id: Number) => {
    confirm('Are you sure, you want to delete?') &&
      this.ticketService.deleteTicketService(id).subscribe((data) => {
        this.fetchTicket();
      });
  };

  fetchTicket = () => {
    this.ticketService.getAllTicketService().subscribe((data) => {
      try {
        this.dataSource = new MatTableDataSource<Ticket>(data['data']);

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

      } catch (error) {
        console.log(error);
      }
    });
  };

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}
