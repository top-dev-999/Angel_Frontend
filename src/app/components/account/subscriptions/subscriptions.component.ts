import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { SubscriptionService } from "../../../services/subscription/subscription.service";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: 'app-subscriptions',
  templateUrl: './subscriptions.component.html',
  styleUrls: ['./subscriptions.component.css']
})
export class SubscriptionsComponent {

  public subscriptions = [];

  constructor(
      private subscriptionService: SubscriptionService,
      private router: Router,
      private loadingService: LoadingService,
  ) {
      this.fetchInvoices();
  }

  fetchInvoices() {
      this.loadingService.show();

      this.subscriptionService.getSubsciptions().subscribe(data => {
          this.loadingService.hide();
          this.subscriptions = data.subscriptions.sort((a,b) => {
              return new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
          });
      }, err => {
          this.loadingService.hide();
      });
  }
  
  formatDate(stringDate) {
      let date = new Date(stringDate);
      let sDate = date.getFullYear() + '/' + this.twoDigitString(date.getMonth() + 1) + '/' + this.twoDigitString(date.getDate());
      let sTime = this.twoDigitString(date.getHours()) + ':' + this.twoDigitString(date.getMinutes())
      return sDate + ' ' + sTime;
  }

  twoDigitString = function(digit) {
      if (digit < 10) {
          return '0' + digit;
      }
      return digit + '';
  }

  navToViewSubscription(subscriptionId) {
      this.router.navigate(['subscription',subscriptionId]);
  }

}
