import { Component, OnInit } from "@angular/core";

import { AlertService } from "../../../services/alert/alert.service";
import { IAlert } from "../../../services/alert/alert.interface";

@Component({
  selector: "app-alert",
  templateUrl: "./alert.component.html",
  styleUrls: ["./alert.component.css"]
})
export class AlertComponent implements OnInit, IAlert {

  public alerts:any[] = [];
  private timeout = 3000;

  constructor(private alertService: AlertService) {
  }

  ngOnInit() {
    this.alertService.subscribeToAlerts(this);
  }

  public onSuccessAlert(text: String) {
    let alert = {
      text: text,
      time: new Date().getTime(),
      type: 'success'
    };

    this.alerts.push(alert);
    setTimeout(() => this.removeAlert(alert), this.timeout);
  }

  public onErrorAlert(text: String) {
    let alert = {
      text: text,
      time: new Date().getTime(),
      type: 'error'
    };

    this.alerts.push(alert);
    setTimeout(() => this.removeAlert(alert), this.timeout);
  }

  public removeAlert(alert) {
    this.alerts = this.alerts.filter(x => x.time != alert.time);
  }

}
