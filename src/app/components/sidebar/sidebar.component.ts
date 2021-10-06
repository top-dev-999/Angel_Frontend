import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

declare interface RouteInfo {
    path: string;
    title: string;
    icon: string;
    class: string;
}
export const ROUTES: RouteInfo[] = [
    
    { path: '/devices', title: 'Devices',  icon:'f3cd', class: 'sidebar-part1' },
    { path: '/contacts', title: 'Contacts',  icon:'f2b9', class: 'sidebar-part1' },
    { path: '/alarms', title: 'Alarm History',  icon:'f0f3', class: 'sidebar-part1' },

    { path: '/check-ins', title: 'Check in History',  icon:'f058', class: 'sidebar-part1' },
    { path: '/account', title: 'Account',  icon:'f007', class: 'sidebar-part1' },
    { path: '/admin/products', title: 'Products',  icon:'design_bullet-list-67', class: 'sidebar-admin' },
    { path: '/admin/comms', title: 'Comms',  icon:'design_bullet-list-67', class: 'sidebar-admin' },
    { path: '/login', title: 'Login',  icon:'design_bullet-list-67', class: 'sidebar-part2' },
    { path: '/register', title: 'Register',  icon:'design_bullet-list-67', class: 'sidebar-part2' }
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  isCollapsed = true;
  hideMenu = false;
  route = '';

  constructor(
    private router: Router,
    public authService: AuthService
  ) {
    router.events.subscribe(val => {
      if (val instanceof NavigationEnd) {
          this.hideMenu = val.url.includes('/order') && !val.url.includes('/orders');
          this.route = val.url;
      }
    });
  }

  isAuthenticated(): boolean {
    return this.authService.isLoggedIn();
  }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
  }
  isMobileMenu() {
      if ( window.innerWidth > 991) {
          return false;
      }
      return true;
  }
  navTo(route) {
    this.isCollapsed = true;
    this.route = route;
    this.router.navigate([route]);
  }

  onLogoutClick() {
    window.location.reload();
    this.isCollapsed = true;
    this.authService.logout();
    this.router.navigate(['/login']);
    return false;
  }
}
