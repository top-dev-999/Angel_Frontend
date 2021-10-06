import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { FileUploader, FileItem } from 'ng2-file-upload';

import { AlertService } from "../../../../services/alert/alert.service";
import { ProfileService } from "../../../../services/profile/profile.service";
import { LoadingService } from "../../../../services/loading.service";
import { StorageService } from "../../../../services/storage/storage.service";
import { environment } from '../../../../../environments/environment';
import { AuthService } from "../../../../services/auth/auth.service";
import { ValidateService } from '../../../../services/validate/validate.service';

@Component({
    selector: "profile",
    templateUrl: "./create-profile.component.html",
    styleUrls: ["./create-profile.component.css"]
})
export class CreateProfileComponent implements OnInit, AfterViewInit {

    public correctNumberFormat: Boolean = true;
    public index = 0;
    public finalStep = 3;
    public numbers: Array<any>;
    public isLoading: Boolean = false;
    public allergy = "";
    public comment = "";
    public images = [];

    public profile: any = {
        name: "",
        surname: "",
        cellPhone: "",
        email: "",
        idNumber: "",
        allergies: [],
        comments: [],
    }

    public expandedImage = null;

    public token = this.storageService.getAuthToken();
    public uploader: FileUploader = new FileUploader({
        url: environment.baseUrl + "/user/profile/file/upload",
        headers: [{ name: 'Authorization', value: "Bearer " + this.token }]
    });

    constructor(
        private loadingService: LoadingService,
        private profileService: ProfileService,
        private alertService: AlertService,
        private storageService: StorageService,
        private authService: AuthService,
        private router: Router
    ) {
        this.numbers = Array(this.finalStep + 1).fill(0).map((x, i) => i);

        this.numbers.splice(1, 1);
    }

    ngOnInit() {
        this.uploader.onBeforeUploadItem = (item) => {
            item.url = environment.baseUrl + "/user/profile/file/upload/" + this.profile.id,
                item.withCredentials = false;
        };
        this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
            let fileReader = new FileReader();
            fileReader.onload = (e: any) => {
                this.images.push({
                    fileItem: fileItem,
                    image: e.target.result
                });
            };
            fileReader.readAsDataURL(fileItem._file);
        };
    }

    ngAfterViewInit() {
        // What's this for?
        var input = document.querySelector("#cellPhone");
    }

    public isStepValid() {
        console.log(this.profile);
        switch (this.index) {
            case 0: return this.profile && this.profile.name && this.profile.surname && this.profile.cellPhone && this.profile.email;
            case 1: return true;
            case 2: return true;
            case 3: return true;
        }
        return false;
    }

    public addAllergy() {
        if (this.allergy) {
            this.profile.allergies.push(this.allergy);
            this.allergy = "";
        }
    }
    public removeAllergy(allergy) {
        this.profile.allergies = this.profile.allergies.filter(x => x != allergy);
    }
    public addComment() {
        if (this.comment) {
            this.profile.comments.push(this.comment);
            this.comment = "";
        }
    }
    public removeComment(comment) {
        this.profile.comments = this.profile.comments.filter(x => x != comment);
    }

    cellNumberChanged(event: any) {
        // The naming convention used here is a bit odd. Coul be: numberChanged
        // Also if user types and then deletes it all, they can save an empty string
        // With the feature addition it's not needed
        this.correctNumberFormat = true;
    }

    public onNextClick() {
        if (this.index < this.finalStep) {
            if (this.correctNumberFormatting()) {
                if (this.index == 0) this.index ++;
                this.index++;
                return;
            }
        }
        else {
            this.createProfile();
        }
    }

    public correctNumberFormatting() {
        if (this.index != 0)
            return true;
        else {
            if (this.profile.cellPhone == null) {
                this.correctNumberFormat = false;
                return false;
            }
            return true;
        }
    }

    private createProfile() {
        let profile = JSON.parse(JSON.stringify(this.profile));
        profile.allergies = JSON.stringify(profile.allergies);
        profile.comments = JSON.stringify(profile.comments);

        this.loadingService.show();
        this.isLoading = true;
        this.profileService.createProfile(profile).subscribe(res => {

            this.profile = res.profile;

            if (this.images.length) {
                this.uploader.uploadAll();
                this.uploader.onCompleteAll = () => {
                    this.createProfileSuccess();
                };
            } else {
                this.createProfileSuccess();
            }

        }, err => {
            this.alertService.alertError("An unexpected error occurred, please try again later");
            this.loadingService.hide();
            this.isLoading = false;
        });

        return false;
    }

    private createProfileSuccess() {
        this.alertService.alertSuccess("Your profile has been created successfully");
        this.loadingService.hide();
        this.isLoading = false;

        if (this.authService.getProfile()) {
            this.router.navigate(['profile', 'edit', this.profile.id]);
        } else {
            this.authService.setProfile(this.profile);
            this.router.navigate(['']);
        }
    }

    public removeImage(image) {
        this.images = this.images.filter(x => x.image != image.image);
        image.fileItem.remove();
    }
}
