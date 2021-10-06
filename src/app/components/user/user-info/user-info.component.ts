import { Component, OnInit } from '@angular/core';

import { AlertService } from "../../../services/alert/alert.service";
import { LoadingService } from "../../../services/loading.service";
import { ProfileService } from "../../../services/profile/profile.service";
import { FileSelectDirective, FileUploader } from 'ng2-file-upload';
import { environment } from '../../../../environments/environment';
import { StorageService } from '../../../services/storage/storage.service';

import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { DeleteItemModalComponent } from '../../common/delete-item-modal/delete-item-modal.component';
import { TextInputModalComponent } from '../../common/text-input-modal/text-input-modal.component';

import { Image } from './models/image';

@Component({
    selector: 'app-user-info',
    templateUrl: './user-info.component.html',
    styleUrls: ['./user-info.component.css']
})
export class UserInfoComponent {

    public userInfo: any = {
        idNumber: '',
        allergies: [],
        comments: []
    };

    public token = this.storageService.getAuthToken();

    public uploader: FileUploader = new FileUploader({
        url: environment.baseUrl + "/user/info/file-upload",
        headers: [{ name: 'Authorization', value: "Bearer " + this.token }]
    });

    public responseList = [];
    public images = <any>[];
    public imageData = [];

    private modalRef: BsModalRef;
    public shade: Boolean = false;
    public selectedImage: any = {};

    constructor(
        private userService: ProfileService,
        private loadingService: LoadingService,
        private alertService: AlertService,
        private storageService: StorageService,
        private modalService: BsModalService
    ) {
        this.getUserInfo();
        this.uploader.onBeforeUploadItem = (item) => {
            item.withCredentials = false;
        }
        this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
            this.responseList.push(response);
            this.images = [];
            this.alertService.alertSuccess('Image successfully uploaded');
            this.getUserImageNames();
        }
    }

    private getUserInfo() {
        this.loadingService.show();

        this.userService.getUserInfo().subscribe(res => {
            if (res.info) {
                this.userInfo = res.info;
                if (res.info.comments) {
                    this.userInfo.comments = JSON.parse(res.info.comments);
                } else {
                    this.userInfo.comments = [];
                }
                if (res.info.allergies) {
                    this.userInfo.allergies = JSON.parse(res.info.allergies);
                } else {
                    this.userInfo.allergies = [];
                }
            }
            this.getUserImageNames();
        }, err => {
            this.loadingService.hide();
        });
    }

    public getUserImageNames() {
        /*this.userService.getProfileImageNames().subscribe(res => {
            this.getUserImages(res.fileNames);
        }, err => {
            this.loadingService.hide();
        });*/

    }

    public getUserImages(userImageNames) {
        /*if (userImageNames == null) { this.loadingService.hide(); }
        else {
            let i = 0;
            userImageNames.forEach(userImage => {
                this.userService.getProfileImage(userImage.fileName).subscribe(imageBlob => {
                    this.imageData.push(userImage);
                    this.createImageFromBlob(imageBlob, i);
                    i++
                }, err => {

                });
            });
            this.loadingService.hide();
        }
        */
    }

    createImageFromBlob(image: Blob, i) {
        let reader = new FileReader();
        reader.addEventListener("load", () => {
            let image = new Image;
            image.imageString = reader.result.toString();
            image.active = false;
            image.fileName = this.imageData[i].fileName;
            image.id = this.imageData[i].id;
            this.images.push(image);
        }, false);

        if (image) {
            reader.readAsDataURL(image);
        }
    }

    onImageClicked(image) {
        this.selectedImage = image;
        this.shade = true;
        this.images.forEach(i => {
            i.active = false;
        })
        image.active = true;
        window.scrollTo(500, 0);
    }

    closeAll() {
        this.selectedImage = {};
        this.shade = false;
        this.images.forEach(i => {
            i.active = false;
        })
    }

    scrollToNextImage() {
        for (let index = 0; index < this.images.length; index++) {
            const image = this.images[index];
            if (image.id == this.selectedImage.id) {
                if (index == this.images.length - 1) {
                    this.selectedImage = this.images[index];
                    break;
                } else {
                    this.selectedImage = this.images[index + 1];
                    break;
                }
            }
        }
    }

    scrollToPrevImage() {
        for (let index = 0; index < this.images.length; index++) {
            const image = this.images[index];
            if (image.id == this.selectedImage.id) {
                if (index == 0) {
                    this.selectedImage = this.images[index];
                    break;
                } else {
                    this.selectedImage = this.images[index - 1];
                    break;
                }
            }
        }
    }



    openDeleteImageModal(image) {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            onDeleteClickedCallback: this.onDeleteImage,
            caller: this,
            message: 'Are you sure you want to remove this image?',
            title: 'Remove Image',
            item: image
        };
        this.modalRef = this.modalService.show(DeleteItemModalComponent, options);
        return false;
    }

    onDeleteImage(modal: DeleteItemModalComponent) {
        let that = modal.caller;
        modal.loading = true;

        //Without the following the payload is too large:
        let image = {
            id: modal.item.id,
            fileName: modal.item.fileName
        }

        that.userService.deleteUserImage(image).subscribe(res => {
            //that.closeAll();
            that.images = [];
            that.getUserImageNames();
            that.alertService.alertSuccess('Image successfully removed');
            that.modalRef.hide();

        },
            err => {
                modal.loading = false;
                modal.error = 'Failed to remove image';
            },
            () => { }
        );
    }

    public openAddAllergyModal() {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            title: "Add Allergy",
            message: "Allergy",
            onAddClickedCallback: this.addAllergy,
            caller: this
        };
        this.modalRef = this.modalService.show(TextInputModalComponent, options);
        return false;
    }

    public addAllergy(modal: TextInputModalComponent) {
        let that = modal.caller;
        modal.loading = true;
        that.userInfo.allergies.push(modal.text);
        that.modalRef.hide();
    }

    public openDeleteAllergyModal(allergy) {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            onDeleteClickedCallback: this.deleteAllergy,
            caller: this,
            message: 'Are you sure you want to remove this allergy?',
            title: 'Remove Allergy',
            item: allergy
        };
        this.modalRef = this.modalService.show(DeleteItemModalComponent, options);
        return false;
    }

    public deleteAllergy (modal: DeleteItemModalComponent) {
        let that = modal.caller;
        modal.loading = true;
        that.userInfo.allergies = that.userInfo.allergies.filter(x => x != modal.item);
        that.modalRef.hide();
    }

    public openAddCommentModal() {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            title: "Add Comment",
            message: "Comment",
            onAddClickedCallback: this.addComment,
            caller: this
        };
        this.modalRef = this.modalService.show(TextInputModalComponent, options);
        return false;
    }

    public addComment(modal: TextInputModalComponent) {
        let that = modal.caller;
        modal.loading = true;
        that.userInfo.comments.push(modal.text);
        that.modalRef.hide();
    }

    public openDeleteCommentModal(comment) {
        let options: ModalOptions = new ModalOptions();
        options.initialState = {
            onDeleteClickedCallback: this.deleteComment,
            caller: this,
            message: 'Are you sure you want to remove this comment?',
            title: 'Remove Comment',
            item: comment
        };
        this.modalRef = this.modalService.show(DeleteItemModalComponent, options);
        return false;
    }

    public deleteComment(modal: DeleteItemModalComponent) {
        let that = modal.caller;
        modal.loading = true;
        that.userInfo.comments = that.userInfo.comments.filter(x => x != modal.item);
        that.modalRef.hide();
    }

    public onUpdateUserInfo() {
        this.loadingService.show();
        let info = JSON.parse(JSON.stringify(this.userInfo));
        info.comments = JSON.stringify(info.comments);
        info.allergies = JSON.stringify(info.allergies);

        this.userService.updateUserInfo(info).subscribe(res => {
            this.alertService.alertSuccess("Your alarm info has been updated successfully");
            this.loadingService.hide();
        }, err => {
            let message = err._body ? err._body : "An unexpected error occurred, please try again later";
            this.alertService.alertError(message);
            this.loadingService.hide();
        });

        return false;
    }

}
