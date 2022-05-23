import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TicketService } from '../../_services/ticket.service';

export interface DialogData {
  ticket_title: '';
  ticket_desc: '';
  edit: false;
}

@Component({
  selector: 'app-create-ticket',
  templateUrl: './create-ticket.component.html',
  styleUrls: ['./create-ticket.component.css'],
})
export class CreateTicketComponent implements OnInit {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private ticketService: TicketService,
    private router: Router
  ) {}
  ngOnInit(): void {}

  add_ticket = new FormGroup({
    ticket_title: new FormControl(),
    ticket_desc: new FormControl(),
  });

  reloadCurrentRoute() {
    let currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }

  handleSubmit = (form: any) => {
    try {
      const response = this.ticketService.createTicketService(form.value);
      response.subscribe((data: any) => {
        if (data['data']) {
          this.ticketService.getAllTicketService();
          this.reloadCurrentRoute();
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
}
