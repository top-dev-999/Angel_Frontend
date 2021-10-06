import { Injectable } from '@angular/core';
import { ILoading } from './loading.interface';

@Injectable()
export class LoadingService {

  private listener: ILoading;

  constructor() { }

  public subscribeToAlerts(listener: ILoading) {
    this.listener = listener;
  }

  public show() {
    if (!this.listener) { return; }

    this.listener.show();
  }

  public hide() {
    if (!this.listener) { return; }
    
    this.listener.hide();
  }
}
