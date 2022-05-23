import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { EnvService } from '../env.service';


@Injectable({
  providedIn: 'root',
})
export class TicketService {
  constructor(private http: HttpClient,private env:EnvService) { }

  public getTicketService(id: Number) {
    return this.http.get(this.env.apiUrl + 'ticket/get/' + id);
  }

  public getAllTicketService() {
    return this.http.get(this.env.apiUrl + 'ticket/getAll').pipe(
      map((res: any) => {
        return res;
      })
    );
  }

  public createTicketService(ticket: any) {
    return this.http.post(this.env.apiUrl + 'ticket/create', ticket);
  }

  public updateTicketService(ticket: any, id: Number) {
    return this.http.put(this.env.apiUrl + 'ticket/update/' + id, ticket);
  }

  public deleteTicketService(id: Number) {
    return this.http.delete(this.env.apiUrl + 'ticket/delete/' + id);
  }
}
