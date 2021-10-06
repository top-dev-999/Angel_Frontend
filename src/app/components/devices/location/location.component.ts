import { Component, OnInit, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { MapsAPILoader } from '@agm/core';

import { AlertService } from '../../../services/alert/alert.service';
import { LoadingService } from '../../../services/loading.service';
import { DeviceLocationService } from '../../../services/device-location/device.location.service';

import { DeviceLocation } from '../../../models/device.location';

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styleUrls: ['./location.component.css']
})
export class LocationComponent implements OnInit {

  @Input() location: DeviceLocation;
  @Input() device;

  @ViewChild('search')
  public searchElementRef: ElementRef;
  public zoom = 10;

  constructor(
    private deviceLocationService: DeviceLocationService,
    private alertService: AlertService,
    private loadingService: LoadingService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone
  ) {
  }

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {

      const autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address']
      });

      autoComplete.addListener('place_changed', () => {
        this.ngZone.run(() => {

          const place: google.maps.places.PlaceResult = autoComplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.location.latitude = place.geometry.location.lat();
          this.location.longitude = place.geometry.location.lng();

          if (this.zoom === 10) { this.zoom = 15; }
        });
      });

      if (!this.location) {
        this.location = new DeviceLocation();
        this.location.deviceId = this.device.id;
        this.location.longitude = 28.0436;
        this.location.latitude = -26.2023;
      } else {
        const location = {
          coords: {
            lat: this.location.latitude,
            lng: this.location.longitude
          }
        };
        this.onMapMarkerSelected(location);
      }
    });
  }

  public onMapMarkerSelected(event) {
    this.location.latitude = event.coords.lat;
    this.location.longitude = event.coords.lng;

    const geocoder = new google.maps.Geocoder;
    const latlng = { lat: event.coords.lat, lng: event.coords.lng };

    geocoder.geocode({ 'location': latlng }, (results, status: any) => {
      if (status === 'OK' && results[0]) {
        this.ngZone.run(() => {
          this.searchElementRef.nativeElement.value = results[0].formatted_address;
        });
      }
    });

    if (this.zoom === 10) { this.zoom = 15; }
  }

  public onSubmit() {
    this.loadingService.show();
    this.deviceLocationService.createOrUpdate(this.location).subscribe(res => {
      this.location = res.location;
      this.alertService.alertSuccess('Location updated successfully');
      this.loadingService.hide();
    }, err => {
      this.alertService.alertError('Failed to update Location');
      this.loadingService.hide();
    });

    return false;
  }
}
