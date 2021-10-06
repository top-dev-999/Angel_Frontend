import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, Params } from "@angular/router";

import { ProfileService } from "../../services/profile/profile.service";
import { AuthService } from "../../services/auth/auth.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {

  public profileLoading = false;

  public image: any;
  public option = 0;

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

  constructor(
      private profileService: ProfileService,
      private authService: AuthService,
      private route: ActivatedRoute,
  ) {
  }
  
  ngOnInit() {
      this.route.params.forEach((params: Params) => {
          this.fetchProfiles();          
      });
  }

  fetchProfiles() {
    this.profileLoading = true;
    this.profileService.getAllProfiles().subscribe(res => {
        let profile = res.profiles.filter(x => x.email == this.authService.getAccount().email)[0];
        this.profile = profile;
        this.profileLoading = false;
        this.fetchProfileImageNames(profile.id);
    }, err => {
        this.profileLoading = false;
    });
}

  private fetchProfileImageNames(profileId) {    
      this.profileService.getProfileImageNames(profileId).subscribe(res => {
          if (res.files && res.files.length) {
            this.fetchProfileImages(profileId, res.files[0]);
          }
      });
  }

  private fetchProfileImages(profileId, file) {
      this.profileService.getProfileImage(profileId, file.file).subscribe(image => {
          this.image = file;
          this.createImageFromBlob(file.id, image);
      });
  }

  private createImageFromBlob(profileImageId, image: Blob) {
      if (!image) { return; }

      let reader = new FileReader();
      reader.addEventListener("load", () => {
          this.image.data = reader.result;
      }, false);

      reader.readAsDataURL(image);
  }

}
