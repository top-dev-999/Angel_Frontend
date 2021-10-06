import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class InvoiceService {

  constructor(private apiService: ApiService) {
  }

  public getInvoices(): Observable<any> {
      return this.apiService.getJson('/user/invoice');
  }

  public getInvoiceById(invoiceId): Observable<any> {
      return this.apiService.getJson(`/user/invoice/${invoiceId}`);
  }

}
