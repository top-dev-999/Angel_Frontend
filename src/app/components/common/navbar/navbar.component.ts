import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AuthService } from '../../../services/auth/auth.service';

@Component({
    selector: 'app-navbar',
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    
    isCollapsed = true;
    hideMenu = false;
    route = '';

    private toggleButton: any;
    private sidebarVisible: boolean;

    mobile_menu_visible: any = 0;

    constructor(
        public authService: AuthService,
        private router: Router,
        private element: ElementRef
    ) {
        router.events.subscribe(val => {
            if (val instanceof NavigationEnd) {
                this.hideMenu = val.url.includes('/order') && !val.url.includes('/orders');
                this.route = val.url;
            }
        });
        this.sidebarVisible = false;
    }

    ngOnInit() {
        const navbar: HTMLElement = this.element.nativeElement;
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];

        this.router.events.subscribe((event) => {
            this.sidebarClose();
             var $layer: any = document.getElementsByClassName('close-layer')[0];
             if ($layer) {
               $layer.remove();
               this.mobile_menu_visible = 0;
             }
        });
    }

    navTo(route) {
        this.isCollapsed = true;
        this.route = route;
        this.router.navigate([route]);
    }

    onLogoutClick() {
        this.isCollapsed = true;
        this.authService.logout();
        this.router.navigate(['/login']);
        return false;
    }

    routeContains(value) {
        return this.route.includes(value);
    }

    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }
    isAdmin(): boolean {
        return this.authService.getRole() == 'admin';
    }

    getInitials() {
        let profile = this.authService.getProfile();
        if (profile) {
            return profile.name[0].toUpperCase() + profile.surname[0].toUpperCase();
        } else { 
            return null; 
        }
    }

    collapse(){
        this.isCollapsed = !this.isCollapsed;
        const navbar = document.getElementsByTagName('nav')[0];
        console.log(navbar);
        if (!this.isCollapsed) {
          navbar.classList.remove('navbar-transparent');
          navbar.classList.add('bg-white');
        }else{
          navbar.classList.add('navbar-transparent');
          navbar.classList.remove('bg-white');
        }
  
    }
  
    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];
        const html = document.getElementsByTagName('html')[0];

        const sidebarPart1 = document.getElementsByClassName('sidebar-part1') as HTMLCollectionOf<HTMLElement>;
        const sidebarPart2 = document.getElementsByClassName('sidebar-part2') as HTMLCollectionOf<HTMLElement>;
        const sidebarAdmin = document.getElementsByClassName('sidebar-admin') as HTMLCollectionOf<HTMLElement>;
        const btnLogout =  <HTMLElement>document.getElementsByClassName('btn-log-out')[0];
        const sideBar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
        
        const authState = this.isAuthenticated();

        sideBar.style.display = 'block';

        if (!authState) {
            const navLogo = <HTMLElement>document.getElementsByClassName('top-nav-logo')[0];
            navLogo.style.display = 'none';
        }

        for (let i = 0; i < sidebarPart1.length; i ++) {
            sidebarPart1[i].style.display = ( authState == true ? 'block' : 'none');
        }

        for (let i = 0; i < sidebarPart2.length; i ++) {
            sidebarPart2[i].style.display = ( authState == false ? 'block' : 'none');
        }

        for (let i = 0; i < sidebarAdmin.length; i ++) {
            sidebarAdmin[i].style.display = (this.isAdmin() == true ? 'block' : 'none');
        }
        
        btnLogout.style.display = ( authState  == true ? 'block' : 'none');
        
        if (window.innerWidth < 991) {
            mainPanel.style.position = 'fixed';
        }

        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);

        html.classList.add('nav-open');

        this.sidebarVisible = true;
    }

    sidebarClose() {
        const html = document.getElementsByTagName('html')[0];
        this.toggleButton.classList.remove('toggled');
        const mainPanel =  <HTMLElement>document.getElementsByClassName('main-panel')[0];

        if (!this.isAuthenticated()) {
            const navLogo = <HTMLElement>document.getElementsByClassName('top-nav-logo')[0];
            navLogo.style.display = 'block';
        }

        if (window.innerWidth < 991) {
            setTimeout(function(){
                mainPanel.style.position = '';
            }, 500);
        }
        this.sidebarVisible = false;
        html.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const html = document.getElementsByTagName('html')[0];
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];

        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
        const html = document.getElementsByTagName('html')[0];

        if (this.mobile_menu_visible == 1) {
            // $('html').removeClass('nav-open');
            html.classList.remove('nav-open');
            if ($layer) {
                $layer.remove();
            }
            setTimeout(function() {
                $toggle.classList.remove('toggled');
            }, 400);

            this.mobile_menu_visible = 0;
        } else {
            setTimeout(function() {
                $toggle.classList.add('toggled');
            }, 430);

            var $layer = document.createElement('div');
            $layer.setAttribute('class', 'close-layer');


            if (html.querySelectorAll('.main-panel')) {
                document.getElementsByClassName('main-panel')[0].appendChild($layer);
            }else if (html.classList.contains('off-canvas-sidebar')) {
                document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
            }

            setTimeout(function() {
                $layer.classList.add('visible');
            }, 100);

            $layer.onclick = function() { //asign a function
            html.classList.remove('nav-open');
            this.mobile_menu_visible = 0;
            $layer.classList.remove('visible');
            setTimeout(function() {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
            }.bind(this);

            html.classList.add('nav-open');
            this.mobile_menu_visible = 1;

        }
    };
}
