import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params  } from '@angular/router';

@Component({
  selector: 'app-payment-complete=',
  templateUrl: './payment-complete.component.html',
  styleUrls: ['./payment-complete.component.css']
})
export class PaymentCompleteComponent implements OnInit {

  public orderId;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.route.params.forEach((params: Params) => {
      this.orderId = params.orderId;
    });
  }

  navToSetupDevice() {
    this.router.navigate(['']);
  }

}
