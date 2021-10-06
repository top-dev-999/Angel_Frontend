import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

import { ProfileService } from "../../../services/profile/profile.service";

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {

  public profileLoading = false;
  public profiles = [];

  constructor(
    private router: Router,
    private profileService: ProfileService,
  ) {
  }

  ngOnInit() {
    this.fetchProfiles();
  }

  private fetchProfiles() {
    this.profileLoading = true;
    this.profileService.getAllProfiles().subscribe(res => {
        this.profiles = res.profiles;
        this.profileLoading = false;
    }, err => {
        this.profileLoading = false;
    });
  }

  navToCreateProfile() {
    this.router.navigate(['profile', 'create']);
  }

  navToEditProfile(profileId) {
    this.router.navigate(['profile', 'edit', profileId]);
  }
}
