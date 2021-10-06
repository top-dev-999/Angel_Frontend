import { Component, OnInit, ViewChildren, ElementRef, QueryList, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { ModalOptions, BsModalService } from 'ngx-bootstrap/modal';

import { AlertService } from '../../../services/alert/alert.service';
import { DeviceService } from '../../../services/device/device.service';
import { AddContactModalComponent } from '../../contacts/add-contact-modal/add-contact-modal.component';
import { ProfileService } from '../../../services/profile/profile.service';
import { ContactEventListener, ContactService } from '../../../services/contact/contact.service';
import { LoadingService } from '../../../services/loading.service';
import { ProductService } from '../../../services/product/product.service';

@Component({
  selector: 'app-create-device',
  templateUrl: './create-device.component.html',
  styleUrls: ['./create-device.component.css']
})
export class CreateDeviceComponent implements OnInit, ContactEventListener {

  public index = 0;
  public finalStep = 3;

  public device = {
    id: '',
    product: { mode: '' },
    productId: '',
    mobileNumber: '',
    unitId: '',
    profileId: '',
    name: '',
    message: '',
    contacts: []
  };

  public profiles = [];
  public products = [];

  @ViewChildren('search')
  public searchElementQuery: QueryList<ElementRef>;
  public searchElementRef: ElementRef;

  constructor(
    private deviceService: DeviceService,
    private alertService: AlertService,
    private router: Router,
    private modalService: BsModalService,
    private profileService: ProfileService,
    private loadingService: LoadingService,
    private contactService: ContactService,
    private productService: ProductService
  ) {
    this.contactService.subscribeToEvents(this);
  }

  ngOnInit() {
    this.fetchProfiles();
    this.fetchProducts();
  }

  private fetchProfiles() {
    this.profileService.getAllProfiles().subscribe(res => {
      this.profiles = res.profiles;
    });
  }

  private fetchProducts() {
    this.productService.getProducts().subscribe(res => {
      this.products = res.products;
    });
  }

  public isStepValid() {
    switch (this.index) {
      case 0: return this.device ? true : false;
      case 1:
        if (this.device.product.mode === 'wifi') {
          return this.device.name && this.device.profileId;
        } else if (this.device.product.mode === 'gsm') {
          return this.device.name && this.device.profileId  && this.device.mobileNumber;
        } else if (this.device.product.mode === 'ring') {
          return this.device.name && this.device.profileId && this.device.mobileNumber;
        }
        return false;
      case 2: return true;
      case 3: return this.device.contacts.length > 0;
    }
    return false;
  }

  public onNextClick() {
    if (this.index < this.finalStep) {
      this.index++;
      return;
    }

    this.createDevice();
  }

  public setDeviceProduct(product) {
    this.device.product = product;
    this.device.productId = product.id;
    this.onNextClick();
  }

  private createDevice() {
    this.loadingService.show();

    this.deviceService.createDevice(this.device).subscribe(res => {
      this.router.navigate(['device', 'edit', res.device.id]);
      this.loadingService.hide();
    }, err => {
      this.alertService.alertError(err._body || 'An unexpected error occurred, please try again later');
      this.loadingService.hide();
    });

    return false;
  }


  public openAddContactModal() {
    let options: ModalOptions = new ModalOptions();
    this.modalService.show(AddContactModalComponent, options);
  }

  public onContactSelected(contact) {
    this.device.contacts.push(contact);
  }

  public removeContact(contact) {
    this.device.contacts = this.device.contacts.filter(x => x.number != contact.number);
  }


  public getDummyMessage() {
    return this.deviceService.getDummyMessage(this.device, this.profiles);
  };
}
