import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { LoadingService } from "../../../services/loading.service";
import { ProfileService } from '../../../services/profile/profile.service';
import { CheckInService } from '../../../services/check-in/check-in.service';

@Component({
    selector: 'app-check-in',
    templateUrl: './check-in.component.html',
    styleUrls: ['./check-in.component.css']
})
export class CheckInComponent {

    public checkIn: any = {};
    private profiles = [];

    constructor(
        private checkInService: CheckInService,
        private profileService: ProfileService,
        private loadingService: LoadingService,
        private mapsAPILoader: MapsAPILoader,
        private route: ActivatedRoute,
    ) {
        this.loadingService.show();
        this.mapsAPILoader.load().then(() => {
            this.route.params.forEach((params: Params) => {
                this.fetchCheckIn(params.checkInId);
            });
        });

        this.fetchProfiles();
    }

    fetchCheckIn(checkInId) {
        this.checkInService.getCheckIn(checkInId).subscribe(res => {
            this.loadingService.hide();
            this.checkIn = res.checkIn;
        }, err => {
            this.loadingService.hide();
        });
    }

    fetchProfiles() {
        this.profileService.getAllProfiles().subscribe(res => {
            this.profiles = res.profiles;
        });
    }

    formatDate(stringDate) {
        if (!stringDate) { return ''; }
        let date = new Date(stringDate);
        let sDate = date.getFullYear() + '/' + this.twoDigitString(date.getMonth() + 1) + '/' + this.twoDigitString(date.getDate());
        let sTime = this.twoDigitString(date.getHours()) + ':' + this.twoDigitString(date.getMinutes())
        return sDate + ' ' + sTime;
    }

    twoDigitString = function (digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }

    getRecipients() {
        if (!this.checkIn.recipients) { return []; }
        return JSON.parse(this.checkIn.recipients);
    }


    getProfileName(profileId) {
        let profile = this.profiles.filter(x => x.id == profileId)[0];
        if (profile) {
            return profile.name + ' ' + profile.surname; 
        }
        return '';
    }
}
