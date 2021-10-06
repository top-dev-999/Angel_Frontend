import { Component, OnInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { MapsAPILoader } from '@agm/core';

import { AlertService } from '../../../services/alert/alert.service';
import { DeviceService } from '../../../services/device/device.service';
import { DeleteItemModalComponent } from '../../common/delete-item-modal/delete-item-modal.component';
import { LoadingService } from '../../../services/loading.service';
import { ProfileService } from '../../../services/profile/profile.service';
import { AddContactModalComponent } from '../../contacts/add-contact-modal/add-contact-modal.component';
import { ContactService, ContactEventListener } from '../../../services/contact/contact.service';
import { AuthService } from '../../../services/auth/auth.service';
import { DeviceLocationService } from '../../../services/device-location/device.location.service';

@Component({
  selector: 'app-edit-device',
  templateUrl: './edit-device.component.html',
  styleUrls: ['./edit-device.component.css']
})
export class EditDeviceComponent implements OnInit, ContactEventListener {

  public option = 0;
  public device: any = {};
  public wifi: any = {};
  public location: DeviceLocationService;
  public contacts = [];
  public regions = [];
  public profiles = [];

  private modalRef: BsModalRef;

  constructor(
    private deviceService: DeviceService,
    private alertService: AlertService,
    private contactService: ContactService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private ngZone: NgZone,
    private loadingService: LoadingService,
    private profileService: ProfileService,
    private mapsAPILoader: MapsAPILoader,
    private authService: AuthService
  ) {
    this.contactService.subscribeToEvents(this);
  }

  ngOnInit() {
    this.loadingService.show();
    this.fetchProfiles();

    this.route.params.forEach((params: Params) => {
      this.fetchDevice(params.deviceId);
    });
  }

  private fetchProfiles() {
    this.profileService.getAllProfiles().subscribe(res => {
      this.profiles = res.profiles;
    });
  }

  private fetchDevice(deviceId) {
    this.loadingService.show();
    this.deviceService.getDevice(deviceId).subscribe(res => {
      this.device = res.device;
      this.regions = res.device.regions;
      this.contacts = res.device.contacts;
      this.wifi = res.device.wifi || { new: true };
      this.location = res.device.location;

      this.getRegionLocationNames();
      this.loadingService.hide();
    }, err => {
      this.loadingService.hide();
      this.alertService.alertError('Failed to load device');
    });
  }

  private getRegionLocationNames() {
    this.mapsAPILoader.load().then(() => {
      const geocoder = new google.maps.Geocoder;

      for (const region of this.regions) {
        region.location = `Lat: ${region.latitude} Long: ${region.longitude}`;
        const latlng = { lat: region.latitude, lng: region.longitude };
        geocoder.geocode({ 'location': latlng }, (results, status: any) => {
          if (status === 'OK' && results[0]) {
            this.ngZone.run(() => {
              region.location = results[0].formatted_address;
            });
          }
        });
      }
    });
  }

  onEditDevice() {
    this.device.contacts = this.contacts;
    this.loadingService.show();

    this.deviceService.updateDevice(this.device).subscribe(res => {
      this.device = res.device;
      this.alertService.alertSuccess('Device updated successfully');
      this.loadingService.hide();
    }, err => {
      this.alertService.alertError('Failed to update device');
      this.loadingService.hide();
    });

    return false;
  }

  openDeleteDeviceModal() {
    const options: ModalOptions = new ModalOptions();
    options.initialState = {
      onDeleteClickedCallback: this.onDeleteDevice,
      caller: this,
      message: 'This will remove this device from your account. Are you sure?',
      title: 'Remove Device'
    };
    this.modalRef = this.modalService.show(DeleteItemModalComponent, options);
    return false;
  }

  onDeleteDevice(modal: DeleteItemModalComponent) {
    const that: EditDeviceComponent = modal.caller;
    modal.loading = true;

    that.deviceService.deleteDevice(that.device).subscribe(res => {
      that.router.navigate(['']);
      that.alertService.alertSuccess('Device successfully removed');
      that.modalRef.hide();
    }, err => {
      modal.loading = false;
      modal.error = 'Failed to remove device';
    });
  }


  public openAddContactModal() {
    this.modalService.show(AddContactModalComponent);
  }
  public onContactSelected(contact) {
    this.contacts.push(contact);
  }
  public removeContact(contact) {
    this.contacts = this.contacts.filter(x => x.id !== contact.id);
  }

  navToEditRegion(region) {
    this.router.navigate(['device', this.device.id, 'region', 'edit', region.id]);
  }

  navToCreateRegion() {
    this.router.navigate(['device', this.device.id, 'region', 'create']);
  }


  public getDummyMessage() {
    return this.deviceService.getDummyMessage(this.device, this.profiles);
  }

  public isWiFiDevice() {
    return (this.device.product && this.device.product.mode === 'wifi');
  }

  public isGSMDevice() {
    return (this.device.product && this.device.product.mode === 'gsm');
  }

  public isRingDevice() {
    return (this.device.product && this.device.product.mode === 'ring');
  }

  public getDeviceTabName() {
    if (this.isWiFiDevice()) { return 'WiFi'; }
    if (this.isGSMDevice()) { return 'Regions'; }
    if (this.isRingDevice()) { return 'Location'; }
    return '';
  }

  public isAdmin() {
    return this.authService.getRole() === 'admin';
  }
}
