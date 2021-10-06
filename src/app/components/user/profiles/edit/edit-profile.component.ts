import { Component, OnInit, ViewChild } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";
import { FileUploader, FileItem } from "ng2-file-upload";

import { AlertService } from "../../../../services/alert/alert.service";
import { ProfileService } from "../../../../services/profile/profile.service";
import { LoadingService } from "../../../../services/loading.service";
import { StorageService } from "../../../../services/storage/storage.service";
import { environment } from "../../../../../environments/environment";
import { ModalOptions, BsModalService } from "ngx-bootstrap/modal";
import { DeleteItemModalComponent } from "../../../common/delete-item-modal/delete-item-modal.component";
import { IntlTelInputComponent } from "intl-tel-input-ng";



@Component({
    selector: "profile",
    templateUrl: "./edit-profile.component.html",
    styleUrls: ["./edit-profile.component.css"]
})
export class EditProfileComponent implements OnInit {

    @ViewChild(IntlTelInputComponent)
    public intlTelInputComponent: IntlTelInputComponent;


    public correctNumberFormat: Boolean = true;
    public option = 0;
    public isLoading: Boolean = false;
    public allergy = "";
    public comment = "";
    public images = [];
    public newImages = [];

    public profile: any = {
        name: "",
        surname: "",
        cellPhone: "",
        email: "",
        idNumber: "",
        allergies: [],
        comments: [],
    };

    public uploader: FileUploader;
    public expandedImage = null;

    constructor(
        private loadingService: LoadingService,
        private storageService: StorageService,
        private profileService: ProfileService,
        private alertService: AlertService,
        private route: ActivatedRoute,
        private router: Router,
        private modalService: BsModalService
    ) {
    }

    ngOnInit() {
        this.route.params.forEach((params: Params) => {
            this.fetchProfile(params.profileId);
            this.fetchProfileImageNames(params.profileId);

            let token = this.storageService.getAuthToken();
            this.uploader = new FileUploader({
                url: environment.baseUrl + "/user/profile/file/upload/" + params.profileId,
                headers: [{ name: 'Authorization', value: "Bearer " + token }]
            });

            this.uploader.onBeforeUploadItem = (item) => {
                item.withCredentials = false;
            };
            this.uploader.onAfterAddingFile = (fileItem: FileItem) => {
                let fileReader = new FileReader();
                fileReader.onload = (e: any) => {
                    this.newImages.push({
                        fileItem: fileItem,
                        image: e.target.result
                    });
                };
                fileReader.readAsDataURL(fileItem._file);
            };
        });
    }

    private fetchProfile(profileId) {
        this.loadingService.show();

        this.profileService.getProfile(profileId).subscribe(res => {
            let profile = res.profile;
            profile.allergies = JSON.parse(profile.allergies);
            profile.comments = JSON.parse(profile.comments);
            this.profile = profile;
            this.intlTelInputComponent.phoneNumber = this.profile.cellPhone;

            this.loadingService.hide();
        }, err => {
            this.alertService.alertError('Failed to fetch your profile');
            this.loadingService.hide();
        });
    }

    private fetchProfileImageNames(profileId) {
        this.profileService.getProfileImageNames(profileId).subscribe(res => {
            this.fetchProfileImages(profileId, res.files);
        });
    }

    private fetchProfileImages(profileId, files) {
        files.forEach(file => {
            this.profileService.getProfileImage(profileId, file.file).subscribe(image => {
                this.images.push(file);
                this.createImageFromBlob(file.id, image);
            });
        });
    }

    private createImageFromBlob(profileImageId, image: Blob) {
        if (!image) { return; }

        let reader = new FileReader();
        reader.addEventListener("load", () => {
            this.images.filter(x => x.id == profileImageId)[0].data = reader.result;
        }, false);

        reader.readAsDataURL(image);
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

    public cellNumberChanged(event: any) {
        this.correctNumberFormat = true;
    }

    public removeNewImage(image) {
        this.newImages = this.newImages.filter(x => x.image != image.image);
        image.fileItem.remove();
    }

    public saveNewImages() {
        this.loadingService.show();
        this.uploader.onCompleteAll = () => {
            this.alertService.alertSuccess("Images Successfully Uploaded");
            this.images = [];
            this.newImages = [];
            this.fetchProfileImageNames(this.profile.id);
            this.loadingService.hide();
        };
        this.uploader.uploadAll();
    }



    public openDeleteImageModal(image) {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            onDeleteClickedCallback: this.onDeleteImage,
            caller: this,
            message: 'Are you sure you want to remove this image?',
            title: 'Remove Image',
            item: image
        };
        this.modalService.show(DeleteItemModalComponent, options);
        return false;
    }

    private onDeleteImage(modal: DeleteItemModalComponent) {
        let that = modal.caller;
        modal.loading = true;

        // without this the payload is too large:
        let image = {
            id: modal.item.id,
            profileId: modal.item.profileId,
            file: modal.item.file
        };

        that.profileService.deleteProfileImage(image).subscribe(res => {
            that.images = [];
            that.newImages = [];
            that.fetchProfileImageNames(image.profileId);
            modal.bsModalRef.hide();
            that.alertService.alertSuccess('Image successfully removed');
        }, err => {
            modal.loading = false;
            modal.error = 'Failed to remove image';
        });
    }

    onSaveClicked() {
        if (!this.profile.name || !this.profile.surname || !this.profile.cellPhone || !this.profile.email) {
            this.alertService.alertError('Please capture all required fields before saving');
            return false;
        }

        let profile = JSON.parse(JSON.stringify(this.profile));
        profile.allergies = JSON.stringify(profile.allergies);
        profile.comments = JSON.stringify(profile.comments);

        this.loadingService.show();
        this.profileService.updateProfile(profile).subscribe(res => {
            this.alertService.alertSuccess("Your profile has been updated successfully");
            this.loadingService.hide();
        }, err => {
            this.alertService.alertError("An unexpected error occurred, please try again later");
            this.loadingService.hide();
        });

        return false;
    }

    navToChangePassword() {
        this.router.navigate(["change-password"]);
    }

    navToAlarmInfo() {
        this.router.navigate(["info"]);
    }
}
