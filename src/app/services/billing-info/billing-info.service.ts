import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api/api.service';

@Injectable()
export class BillingInfoService {

    constructor(private apiService: ApiService) {}

    getBillingInfo(): Observable<any> {
        return this.apiService.getJson('/user/billing-info');
    }

    createBillingInfo(billingInfo): Observable<any> {
        return this.apiService.postJson('/user/billing-info', billingInfo);
    }

    updateBillingInfo(billingInfo): Observable<any> {
        return this.apiService.postJson('/user/billing-info/update', billingInfo);
    }
}
