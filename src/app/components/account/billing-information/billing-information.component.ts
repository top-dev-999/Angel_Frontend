import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";

import { AlertService } from "../../../services/alert/alert.service";
import { BillingInfoService } from "../../../services/billing-info/billing-info.service";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: 'app-billing-information',
  templateUrl: './billing-information.component.html',
  styleUrls: ['./billing-information.component.css']
})
export class BillingInformationComponent implements OnInit {

  @Output() onBillingInfoSaved = new EventEmitter<any>();

  public info = {
    id: null,
    accountId: '', 
    name: '',
    surname: '',
    cellphone: '',
    addressLine1: '',
    addressLine2: '',
    suburb: '',
    province: '',
    postalCode: '',
    createAt: null,
    updatedAt: null
  };

  constructor(
      private billingInfoService: BillingInfoService,
      private alertService: AlertService,
      private loadingService: LoadingService
  ) {}

  ngOnInit() {
      this.fetchBillingInfo();
  }

  private fetchBillingInfo() {
      this.loadingService.show();

      this.billingInfoService.getBillingInfo().subscribe(res => {
          if (res.billingInfo) {
              this.info = res.billingInfo;
          }
          this.loadingService.hide();
      }, err => {
          this.alertService.alertError(err.message ? err.message : err);
          this.loadingService.hide();
      });
  }

  saveBillingInfo() { 

      let billingInfoObservable: Observable<any> = null;
      if (this.info.id) {
          billingInfoObservable = this.billingInfoService.updateBillingInfo(this.info);
      } else {
          billingInfoObservable = this.billingInfoService.createBillingInfo(this.info);
      }

      this.loadingService.show();
      
      billingInfoObservable.subscribe(res => {
          this.onBillingInfoSaved.emit(res.billingInfo);
          this.loadingService.hide();
      }, err => {
          this.alertService.alertError(err.message ? err.message : err);
          this.loadingService.hide();
      });
  }

}