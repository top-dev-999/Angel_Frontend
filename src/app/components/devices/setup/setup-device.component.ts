import { Component, OnInit, ViewChildren, ElementRef, QueryList, NgZone } from "@angular/core";
import { Router, Params, ActivatedRoute } from "@angular/router";
import { ModalOptions, BsModalService, BsModalRef } from "ngx-bootstrap/modal";

import { AlertService } from "../../../services/alert/alert.service";
import { DeviceService } from "../../../services/device/device.service";
import { AddContactModalComponent } from "../../contacts/add-contact-modal/add-contact-modal.component";
import { ProfileService } from "../../../services/profile/profile.service";
import { ContactEventListener, ContactService } from "../../../services/contact/contact.service";
import { LoadingService } from "../../../services/loading.service";
import { ProductService } from "../../../services/product/product.service";

@Component({
    selector: "setup-device",
    templateUrl: "./setup-device.component.html",
    styleUrls: ["./setup-device.component.css"]
})
export class SetupDeviceComponent implements OnInit, ContactEventListener {

    public index = 0;
    public finalStep = 2;

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

    @ViewChildren("search")
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
        private productService: ProductService,
        private route: ActivatedRoute
    ) {
        this.contactService.subscribeToEvents(this);
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.fetchDevice(params.deviceId);
        });
        this.fetchProfiles();
        this.fetchProducts();
    }

    private fetchDevice(deviceId) {
        this.loadingService.show();
        this.deviceService.getDevice(deviceId).subscribe(res => {
            this.device = res.device;
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to fetch device');
            this.loadingService.hide();
            this.router.navigate(['']);
        });
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
            case 0: 
                let validNameAndProfile = this.device.name && this.device.profileId;
                if (this.device.product.mode == 'wifi') {
                    return validNameAndProfile && this.device.unitId;
                } else if (this.device.product.mode == 'gsm') {
                    return validNameAndProfile && this.device.unitId && this.isValidMobile();
                }
                return false;
            case 1: return true;
            case 2: return this.device.contacts.length > 0;
        }
        return false;
    }

    private isValidMobile() {
        if (this.device.product.mode == 'wifi') { return true; }
        if (!this.device.mobileNumber || !this.device.mobileNumber.startsWith('+27')) { return false; }
        let number = this.device.mobileNumber.substr(3);
        return /^\d+$/.test(number) && number.length == 9;
    }

    public onNextClick() {
        if (this.index < this.finalStep) {
            this.index++;
            return;
        }

        this.setupDevice();
    }

    public setDeviceProduct(product) {
        this.device.product = product;
        this.device.productId = product.id;
        this.onNextClick();
    }

    private setupDevice() {
        this.loadingService.show();

        this.deviceService.setupDevice(this.device).subscribe(res => {
            this.router.navigate(['device', 'edit', res.device.id]);
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError(err._body || "An unexpected error occurred, please try again later");
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
