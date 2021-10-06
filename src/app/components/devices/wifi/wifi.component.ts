import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MapsAPILoader } from '@agm/core';

import { AlertService } from '../../../services/alert/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { WifiService } from '../../../services/wifi/wifi.service';

@Component({
    selector: 'app-wifi',
    templateUrl: './wifi.component.html',
    styleUrls: ['./wifi.component.css']
})
export class WifiComponent implements OnInit {

    @Input() wifi: any;
    @Input() device: any;

    @ViewChild("search")
    public searchElementRef: ElementRef;
    public zoom = 10;

    constructor(
        private wifiService: WifiService,
        private alertService: AlertService,
        private loadingService: LoadingService,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone
    ) {

    }

    ngOnInit() {
        this.mapsAPILoader.load().then(() => {

            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
                types: ["address"]
            });

            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {

                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
                        return;
                    }

                    this.wifi.latitude = place.geometry.location.lat();
                    this.wifi.longitude = place.geometry.location.lng();

                    if (this.zoom == 10) { this.zoom = 15; }
                });
            });
            
            if (this.wifi.new) {
                this.wifi.longitude = 28.0436;
                this.wifi.latitude = -26.2023;
            } else {
                let startLocation = {
                    coords: {
                        lat: this.wifi.latitude,
                        lng: this.wifi.longitude
                    }
                }
                this.onMapMarkerSelected(startLocation);
            }
        });
    }

    public onMapMarkerSelected(event) {
        this.wifi.latitude = event.coords.lat;
        this.wifi.longitude = event.coords.lng;

        var geocoder = new google.maps.Geocoder;
        var latlng = { lat: event.coords.lat, lng: event.coords.lng };

        geocoder.geocode({ 'location': latlng }, (results, status: any) => {
            if (status === 'OK' && results[0]) {
                this.searchElementRef.nativeElement.value = results[0].formatted_address;
            }
        });

        if (this.zoom == 10) { this.zoom = 15; }
    }

    public onWifiSubmit() {
        let observable: Observable<any>;

        if (this.wifi.new) {
            observable = this.wifiService.createWifi(this.device.id, this.wifi);
        } else {
            observable = this.wifiService.updateWifi(this.device.id, this.wifi);
        }

        this.loadingService.show();
        observable.subscribe(res => {
            this.wifi = res.wifi;
            this.alertService.alertSuccess('WIFI updated successfully');
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to update WIFI');
            this.loadingService.hide();
        });

        return false;
    }
}
