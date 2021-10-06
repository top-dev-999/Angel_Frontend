import { Component } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { MapsAPILoader } from '@agm/core';

import { AlarmService } from "../../../services/alarm/alarm.service";
import { LoadingService } from "../../../services/loading.service";
import { ProfileService } from '../../../services/profile/profile.service';

@Component({
    selector: 'app-alarm-info',
    templateUrl: './alarm-info.component.html',
    styleUrls: ['./alarm-info.component.css']
})
export class AlarmInfoComponent {

    private profiles = [];
    public alarm: any = {};
    public profile: any = null;
    public error = '';
    public images = [];
    public expandedImage = null;

    constructor(
        private alarmService: AlarmService,
        private loadingService: LoadingService,
        private route: ActivatedRoute,
        private profileService: ProfileService,
        private mapsAPILoader: MapsAPILoader
    ) {
        this.mapsAPILoader.load().then(() => {
            this.route.params.forEach((params: Params) => {
                this.fetchAlarmInfo(params.alarmId);
            });
        });

        this.fetchProfiles();
    }

    fetchAlarmInfo(alarmId) {
        this.loadingService.show();

        this.alarmService.getAlarmInfo(alarmId).subscribe(res => {
            this.alarm = res.alarm;

            let profile = res.profile;
            profile.allergies = JSON.parse(profile.allergies);
            profile.comments = JSON.parse(profile.comments);
            this.profile = profile;

            this.loadingService.hide();

            this.getAlarmProfileImageNames(alarmId, profile.id);
        }, err => {
            if (err._body) { this.error = err._body; }
            this.loadingService.hide();
        });
    }

    public getAlarmProfileImageNames(alarmId, profileId) {
        this.alarmService.getAlarmProfileImageNames(alarmId).subscribe(res => {
            this.getAlarmProfileImages(res.files, profileId);
        }, err => {
            this.loadingService.hide();
        });
    }

    public getAlarmProfileImages(files, profileId) {
        files.forEach(file => {
            this.alarmService.getAlarmProfileImage(profileId, file.file).subscribe(blob => {
                this.images.push(file);
                this.createImageFromBlob(blob, file.id);
            });
        });
    }

    createImageFromBlob(image: Blob, profileFileId) {
        if (!image) { return; }

        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.images.filter(x => x.id == profileFileId)[0].data = reader.result;
        }, false);

        reader.readAsDataURL(image);
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
