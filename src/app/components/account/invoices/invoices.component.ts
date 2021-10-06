import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { InvoiceService } from "../../../services/invoice/invoice.service";
import { LoadingService } from "../../../services/loading.service";

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent {

  public invoices = [];

  constructor(
      private invoiceService: InvoiceService,
      private router: Router,
      private loadingService: LoadingService,
  ) {
      this.fetchInvoices();
  }

  fetchInvoices() {
      this.loadingService.show();

      this.invoiceService.getInvoices().subscribe(data => {
          this.loadingService.hide();
          this.invoices = data.invoices.sort((a,b) => {
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

  navToViewInvoice(invoiceId) {
      this.router.navigate(['invoice',invoiceId]);
  }

}
