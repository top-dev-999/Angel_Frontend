import { Component } from "@angular/core";
import { AuthService } from "./services/auth/auth.service";
import { Router, RouterEvent, NavigationEnd } from "@angular/router";
import { Console } from "console";

@Component({
    selector: "app-root",
    templateUrl: "./app.component.html",
    styleUrls: ["./app.component.css"]
})
export class AppComponent {

    private validUnauthenticatedRoutes = ['/login', '/register', '/forgot-password', '/alarm/info', '/terms-and-conditions', '/order'];
    private adminRoutes = ['/admin'];
    mainWidth = {};
    Isfirst = true;

    constructor(
        public authService: AuthService,
        private router: Router
    ) {
        router.events.subscribe(evt => {
            if (evt instanceof NavigationEnd) {
                window.scrollTo(0, 0);
                this.authService.checkTokenStatus();
                this.guardRoute(evt);
            }
        });
    }

  
    guardRoute(evt: RouterEvent) {

        const sideBar =  <HTMLElement>document.getElementsByClassName('sidebar')[0];
        sideBar.style.display = (this.authService.isLoggedIn() == true ? 'block' : 'none');

        this.mainWidth = (this.authService.isLoggedIn() == false ? {width: '100%'} : {} );
        
        for (let i in this.validUnauthenticatedRoutes) {
            let route = this.validUnauthenticatedRoutes[i];
            if (evt.url.includes(route)) {  return; }
        }

        if (this.adminRoutes.includes(evt.url)) {
            if (this.authService.isLoggedIn() && this.authService.getAccount().role == 'admin') {
                return;
            }
        } else if (this.authService.isLoggedIn()) {
            return;
        }
        this.router.navigate(['/login']);
    }
    
    isAuthenticated(): boolean {
        return this.authService.isLoggedIn();
    }
}
