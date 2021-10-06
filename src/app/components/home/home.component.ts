import { Component, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { BsModalService, ModalOptions, BsModalRef } from "ngx-bootstrap/modal";

import { DeviceService } from "../../services/device/device.service";
import { AlarmService } from "../../services/alarm/alarm.service";
import { ProfileService } from "../../services/profile/profile.service";
import { ContactService, ContactEventListener } from "../../services/contact/contact.service";
import { ProductService } from "../../services/product/product.service";
import { AuthService } from "../../services/auth/auth.service";
import { CheckInService } from "../../services/check-in/check-in.service";

import { AddContactModalComponent } from "../contacts/add-contact-modal/add-contact-modal.component";
import { EditContactModalComponent } from "../contacts/edit-contact-modal/edit-contact-modal.component";
import { LoadingService } from "../../services/loading.service";

@Component({
    selector: "app-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.css"]
})
export class HomeComponent implements OnInit, ContactEventListener {

    public profileLoading = false;
    public deviceLoading = false;
    public alarmLoading = false;
    public checkInLoading = false;
    public contactsLoading = false;

    public profiles = [];
    public devices = [];
    public alarms = [];
    public checkIns = [];
    public contacts = [];
    public products = [];

    public stateToUpdate: String;
    public deviceToUpdate: String;
    public bsModalRef: BsModalRef;

    @ViewChild('stateConfirmModal') stateConfirmModal;

    constructor(
        private router: Router,
        private loadingService: LoadingService,
        private modalService: BsModalService,
        private profileService: ProfileService,
        private deviceService: DeviceService,
        private contactService: ContactService,
        private alarmService: AlarmService,
        private checkInService: CheckInService,
        private productService: ProductService,
        private authService: AuthService
    ) {
    }

    ngOnInit() {
        this.fetchProducts();
        this.fetchProfiles();
        this.fetchDevices();
        this.fetchAlarms();
        this.fetchCheckIns();
        this.fetchContacts();

        this.contactService.subscribeToEvents(this);
    }

    private fetchProducts() {
        this.productService.getProducts().subscribe(res => {
            this.products = res.products;
        });
    }

    private fetchProfiles() {
        this.profileLoading = true;
        this.profileService.getAllProfiles().subscribe(res => {
            this.profiles = res.profiles;
            this.profileLoading = false;
        }, err => {
            this.profileLoading = false;
        });
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

    private fetchAlarms() {
        this.alarmLoading = true;
        this.alarmService.getAlarms().subscribe(res => {
            this.alarms = res.alarms.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            });
            this.alarmLoading = false;
        }, err => {
            this.alarmLoading = false;
        });
    }

    private fetchCheckIns() {
        this.checkInLoading = true;
        this.checkInService.getCheckIns().subscribe(res => {
            this.checkIns = res.checkIns.sort((a, b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            });
            this.checkInLoading = false;
        }, err => {
            this.checkInLoading = false;
        });
    }

    private fetchContacts() {
        this.contactsLoading = true;
        this.contactService.getContacts().subscribe(res => {
            this.contacts = res.contacts;
            this.contactsLoading = false;
        }, err => {
            this.contactsLoading = false;
        });
    }



    public openAddContactModal() {
        const options: ModalOptions = new ModalOptions();
        options.initialState = {
            allowSelection: false
        };
        this.modalService.show(AddContactModalComponent, options);
    }

    public openEditContactModal(contact) {
        const options: ModalOptions = new ModalOptions();
        options.initialState = {
            contact: JSON.parse(JSON.stringify(contact)),
        };
        this.modalService.show(EditContactModalComponent, options);
    }

    public onContactAdded(contact) {
        this.contacts.push(contact);
    }
    public onContactUpdated(contact) {
        this.contacts = this.contacts.map(x => {
            if (x.id == contact.id) { x = contact; }
            return x;
        });
    }
    public onContactRemoved(contact) {
        this.contacts = this.contacts.filter(x => x.id != contact.id);
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

    navToCreateProfile() {
        this.router.navigate(['profile', 'create']);
    }

    navToEditProfile(profileId) {
        this.router.navigate(['profile', 'edit', profileId]);
    }


    //Alarms:
    navToAlarms() {
        this.router.navigate(['alarms']);
    }

    navToViewAlarm(alarmId) {
        this.router.navigate(['alarm', alarmId]);
    }

    navToCheckIn(checkInId) {
        this.router.navigate(['check-in', checkInId]);
    }

    getProfileName(profileId) {
        let profile = this.profiles.filter(x => x.id == profileId)[0];
        if (profile) {
            return profile.name + ' ' + profile.surname;
        }
        return '';
    }

    formatDate(stringDate) {
        let date = new Date(stringDate);

        return date.getFullYear() + '/' + this.twoDigitString(date.getMonth() + 1) + '/' + this.twoDigitString(date.getDate());
    }

    twoDigitString = function (digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }

    // arm // disarm
    onArmedChange(armed, device) {
        this.stateToUpdate = armed ? 'armed' : 'disarmed';
        this.deviceToUpdate = device;
        this.showStateConfirmModal();
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

    showStateConfirmModal() {
        this.bsModalRef = this.modalService.show(this.stateConfirmModal);
    }

    close() {
        this.bsModalRef.hide();
    }
}
