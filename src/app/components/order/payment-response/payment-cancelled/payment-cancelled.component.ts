import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment-cancelled',
  templateUrl: './payment-cancelled.component.html',
  styleUrls: ['./payment-cancelled.component.css']
})
export class PaymentCancelledComponent implements OnInit {

  constructor(
      private router: Router
  ) {
  }

  ngOnInit() { }

  navToOrder() {
    this.router.navigate(['order']);
  }

  navToContactUs() {
    this.router.navigate(['']);
  }

}
