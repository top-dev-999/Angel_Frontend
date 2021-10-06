import { Component, OnInit } from "@angular/core";

import { LoadingService } from "../../../services/loading.service";
import { ILoading } from "../../../services/loading.interface";

@Component({
  selector: "app-loading",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.css"]
})
export class LoadingComponent implements ILoading {
  
  public isShown: Boolean = false;

  constructor(private loaderService: LoadingService) {
    loaderService.subscribeToAlerts(this);
  }

  show() {
    this.isShown = true;
  }
  
  hide() {
    this.isShown = false;
  }
}
