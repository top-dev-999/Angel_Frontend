import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions, BsModalRef } from "ngx-bootstrap/modal";

import { DeviceService } from "../../services/device/device.service";
import { LoadingService } from "../../services/loading.service";

@Component({
  selector: 'app-devices',
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {

  public deviceLoading = false;
  public devices = [];
  public products = [];

  public stateToUpdate: String;
  public deviceToUpdate: String;
  public bsModalRef: BsModalRef;

  @ViewChild('stateConfirmModal') stateConfirmModal;

  constructor(
    private router: Router,
    private loadingService: LoadingService,
    private deviceService: DeviceService,
    private modalService: BsModalService,
  ) { }

  ngOnInit() {
    this.fetchDevices();
  }

  private fetchDevices() {
    this.deviceLoading = true;
    this.deviceService.getDevices().subscribe(res => {
        this.devices = res.devices;
        this.deviceLoading = false;
    }, err => {
        this.deviceLoading = false;
    });
  }

  updateDeviceState() {
    this.bsModalRef.hide();
    this.loadingService.show();
    this.deviceService.updateDeviceState(this.deviceToUpdate, this.stateToUpdate).subscribe(res => {
        this.fetchDevices();
        this.loadingService.hide();
    }, err => {
        this.loadingService.hide();
    });
  }

  public getProductImage(productId) {
    let product = this.products.filter(x => x.id == productId)[0];
    if (product) { return product.imagePath; }
    return null;
  }

  navToDevices() {
    this.router.navigate(['devices']);
  }

  navToCreateDevice() {
      this.router.navigate(['device', 'create']);
  }

  navToEditDevice(device) {
      if (device.name) {
          this.router.navigate(['device', 'edit', device.id]);
      } else {
          this.router.navigate(['device', 'setup', device.id]);
      }
  }

  // arm // disarm
  onArmedChange(armed, device) {
    this.stateToUpdate = armed ? 'armed' : 'disarmed';
    this.deviceToUpdate = device;
    this.showStateConfirmModal();
  }

  showStateConfirmModal() {
      this.bsModalRef = this.modalService.show(this.stateConfirmModal);
  }

  close() {
      this.bsModalRef.hide();
  }

}
