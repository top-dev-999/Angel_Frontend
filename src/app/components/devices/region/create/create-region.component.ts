import { Component, OnInit, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { MapsAPILoader } from '@agm/core';

import { AlertService } from '../../../../services/alert/alert.service';
import { DeviceService } from '../../../../services/device/device.service';
import { RegionService } from '../../../../services/region/region.service';
import { MapService } from '../../../../services/map/map.service';

import { AddContactModalComponent } from '../../../contacts/add-contact-modal/add-contact-modal.component';
import { LoadingService } from '../../../../services/loading.service';
import { ContactService, ContactEventListener } from '../../../../services/contact/contact.service';

@Component({
    selector: 'create-region',
    templateUrl: './create-region.component.html',
    styleUrls: ['./create-region.component.css']
})
export class CreateRegionComponent implements OnInit, ContactEventListener {

    public device: any = {};
    public contacts = [];
    public region = {
        name: '',
        longitude: 28.0436,
        latitude: -26.2023,
        message: '',
        radius: 100,
        userDeviceId: '',
        contacts: []
    };

    private modalRef: BsModalRef = null;
    public zoom = 10;

    @ViewChild('search')
    public searchElementRef: ElementRef;

    constructor(
        private regionService: RegionService,
        private deviceService: DeviceService,
        private alertService: AlertService,
        private router: Router,
        private route: ActivatedRoute,
        private loadingService: LoadingService,
        private modalService: BsModalService,
        private mapService: MapService,
        private mapsAPILoader: MapsAPILoader,
        private contactService: ContactService,
        private ngZone: NgZone
    ) {
        this.contactService.subscribeToEvents(this);
        this.route.params.forEach((params: Params) => {
            this.getDevice(params.deviceId);
        });
    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ['address']
            });
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.region.latitude = place.geometry.location.lat();
                    this.region.longitude = place.geometry.location.lng();
                });
            });
        });
    }

    public getDevice(userDeviceId) {
        this.loadingService.show();

        this.deviceService.getDevice(userDeviceId).subscribe(res => {
            this.device = res.device;
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to load device');
            this.loadingService.hide();
            this.navToDevice();
        });
    }

    public onChooseMarker(event) {
        this.region.latitude = event.coords.lat;
        this.region.longitude = event.coords.lng;

        var geocoder = new google.maps.Geocoder;
        var latlng = { lat: event.coords.lat, lng: event.coords.lng };

        geocoder.geocode({ 'location': latlng }, (results, status: any) => {
            if (status === 'OK' && results[0]) {
                this.searchElementRef.nativeElement.value = results[0].formatted_address;
            }
        });
    }

    public serZoom(radius) {
        this.zoom = this.mapService.setZoom(radius);
    }

    public radiusChange(radius) {
        this.region.radius = radius;
        this.zoom = this.mapService.setZoom(radius);
    }

    public openAddContactModal() {
        this.modalService.show(AddContactModalComponent);
    }

    public onContactSelected(contact) {
        this.contacts.push(contact);   
    }
    public removeContact(contact) {
        this.contacts = this.contacts.filter(x => x.id != contact.id);
    }


    public createRegion() {
        this.loadingService.show();

        this.region.contacts = this.contacts;
        this.regionService.createRegion(this.device.id, this.region).subscribe(res => {
            this.loadingService.hide();
            this.navToDevice();
        }, err => {
            this.alertService.alertError('Failed to create region');
            this.loadingService.hide();
        });
    }

    public navToDevice() {
        this.router.navigate(['device','edit',this.device.id]);
    }
}
