import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class OrderService {

  constructor(private apiService: ApiService) { }

  public getAllOrders(): Observable<any> {
    return this.apiService.getJson('/order/all');
  }

  public getOrders(): Observable<any> {
    return this.apiService.getJson('/order');
  }

  public createOrder(order): Observable<any> {
      return this.apiService.postJson(`/order`, order);
  }

}
