import { Injectable } from '@angular/core';
import { IAlert } from './alert.interface';

@Injectable()
export class AlertService {

  listener: IAlert; // TODO: maybe make this an array if needed+

  constructor() { }

  subscribeToAlerts(listener: IAlert) {
    this.listener = listener;
  }

  alertSuccess(text: String) {
    if (!this.listener) { return; }
    this.listener.onSuccessAlert(text);
  }

  alertError(text: String) {
    if (!this.listener) { return; }
    this.listener.onErrorAlert(text);
  }
}
