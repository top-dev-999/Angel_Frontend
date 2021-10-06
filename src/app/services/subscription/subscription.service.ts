import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { ApiService } from "../api/api.service";

@Injectable()
export class SubscriptionService {

  constructor(private apiService: ApiService) { }

  public getSubsciptions(): Observable<any> {
    return this.apiService.getJson('/user/subscription');
  }

  public getSubsciptionById(subscriptionId): Observable<any> {
      return this.apiService.getJson(`/user/subscription/${subscriptionId}`);
  }

}
