import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { AlarmService } from "../../../services/alarm/alarm.service";
import { LoadingService } from "../../../services/loading.service";
import { ProfileService } from '../../../services/profile/profile.service';
import { AlertService } from '../../../services/alert/alert.service';

@Component({
    selector: 'app-alarm',
    templateUrl: './alarm.component.html',
    styleUrls: ['./alarm.component.css']
})
export class AlarmComponent {

    public alarm: any = {};
    private profiles = [];

    constructor(
        private alarmService: AlarmService,
        private profileService: ProfileService,
        private loadingService: LoadingService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private mapsAPILoader: MapsAPILoader
    ) {
        this.mapsAPILoader.load().then(() => {
            this.route.params.forEach((params: Params) => {
                this.fetchAlarm(params.alarmId);
            });
        });

        this.fetchProfiles();
    }

    fetchAlarm(alarmId) {
        this.loadingService.show();

        this.alarmService.getAlarm(alarmId).subscribe(res => {
            this.loadingService.hide();
            this.alarm = res.alarm;
            console.log(res.alarm.aura);
        }, err => {
            this.alertService.alertError(err);
            this.loadingService.hide();
        });
    }


    dismissAlarm() {
        this.loadingService.show();

        this.alarmService.dismissAlarm(this.alarm.id).subscribe(res => {
            this.loadingService.hide();
            this.alarm = res.alarm;
        }, err => {
            this.alertService.alertError(err);
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
        if (!this.alarm.recipients) { return []; }
        return JSON.parse(this.alarm.recipients);
    }


    getProfileName(profileId) {
        let profile = this.profiles.filter(x => x.id == profileId)[0];
        if (profile) {
            return profile.name + ' ' + profile.surname;
        }
        return '';
    }
}
