import { Component } from "@angular/core";
import { Router } from "@angular/router";

import { AlarmService } from "../../services/alarm/alarm.service";
import { DeviceService } from "../../services/device/device.service";
import { LoadingService } from "../../services/loading.service";
import { ProfileService } from "../../services/profile/profile.service";
import { ProductService } from "../../services/product/product.service";
import { CheckInService } from "../../services/check-in/check-in.service";

@Component({
  selector: 'app-check-ins',
  templateUrl: './check-ins.component.html',
  styleUrls: ['./check-ins.component.css']
})
export class CheckInsComponent {

    public checkIns = [];
    private profiles = [];
    private products = [];

    constructor(
        private checkInService: CheckInService,
        private router: Router,
        private loadingService: LoadingService,
        private profileService: ProfileService,
        private productService: ProductService
    ) {
        this.fetchProfiles();
        this.fetchProducts();
        this.fetchCheckIns();
    }

    fetchProfiles() {
        this.profileService.getAllProfiles().subscribe(res => {
            this.profiles = res.profiles;
        });
    }
    
    fetchProducts() {
        this.productService.getProducts().subscribe(res => {
            this.products = res.products;
        });
    }

    fetchCheckIns() {
        this.loadingService.show();

        this.checkInService.getCheckIns().subscribe(data => {
            this.loadingService.hide();
            this.checkIns = data.checkIns.sort((a,b) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            });
        }, err => {
            this.loadingService.hide();
        });
    }
    
    getDeviceTypeImage(type) {
        if (type == 'angel-alert') { return 'assets/AA_logo.png'; }
        if (type == 'car-angel') { return 'assets/CA_logo.png'; }
        if (type == 'sports-angel') { return 'assets/SA_logo.png'; }
        return '';
    }

    formatDate(stringDate) {
        let date = new Date(stringDate);
        let sDate = date.getFullYear() + '/' + this.twoDigitString(date.getMonth() + 1) + '/' + this.twoDigitString(date.getDate());
        let sTime = this.twoDigitString(date.getHours()) + ':' + this.twoDigitString(date.getMinutes())
        return sDate + ' ' + sTime;
    }

    twoDigitString = function(digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }

    navToViewAlarm(alarmId) {
        this.router.navigate(['alarm',alarmId]);
    }

    getProfileName(profileId) {
        let profile = this.profiles.filter(x => x.id == profileId)[0];
        if (profile) {
            return profile.name + ' ' + profile.surname; 
        }
        return '';
    }

    public getProductImage(productId) {
        let product = this.products.filter(x => x.id == productId)[0];
        if (product) { return product.imagePath; }
        return null;
    }
}
