/// <reference types="@types/googlemaps" />
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { AgmCoreModule } from '@agm/core';
import { AlertModule } from 'ngx-bootstrap/alert';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { FileUploadModule } from 'ng2-file-upload';
import { YoutubePlayerModule } from 'ngx-youtube-player';
import { IntlTelInputNgModule } from 'intl-tel-input-ng';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import { NavbarComponent } from './components/common/navbar/navbar.component';
import { AlertComponent } from './components/common/alert/alert.component';
import { LoginComponent } from './components/auth/login/login.component';
import { ForgotPasswordComponent } from './components/auth/forgot-password/forgot-password.component';
import { RegisterComponent } from './components/auth/register/register.component';
import { ChangePasswordComponent } from './components/user/change-password/change-password.component';
import { AlarmComponent } from './components/alarms/alarm/alarm.component';
import { AlarmsComponent } from './components/alarms/alarms.component';
import { AlarmInfoComponent } from './components/alarms/alarm-info/alarm-info.component';
import { UserInfoComponent } from './components/user/user-info/user-info.component';
import { CommsComponent } from './components/admin/comms/comms.component';
import { LoadingComponent } from './components/common/loading/loading.component';
import { FooterComponent } from './components/common/footer/footer.component';
import { TermsAndConditionsComponent } from './components/terms-and-conditions/terms-and-conditions.component';
import { AccountComponent } from './components/account/account.component';
import { PaymentCompleteComponent } from './components/order/payment-response/payment-complete/payment-complete.component';
import { PaymentCancelledComponent } from './components/order/payment-response/payment-cancelled/payment-cancelled.component';
import { ToggleComponent } from './components/common/toggle/toggle.component';

import { SidebarComponent } from './components/sidebar/sidebar.component';
// profile components
import { ProfilesComponent } from './components/user/profiles/profiles.component';
import { CreateProfileComponent } from './components/user/profiles/create/create-profile.component';
import { EditProfileComponent } from './components/user/profiles/edit/edit-profile.component';
// device components
import { SetupDeviceComponent } from './components/devices/setup/setup-device.component';
import { CreateDeviceComponent } from './components/devices/create/create-device.component';
import { EditDeviceComponent } from './components/devices/edit/edit-device.component';
// region components
import { CreateRegionComponent } from './components/devices/region/create/create-region.component';
import { EditRegionComponent } from './components/devices/region/edit/edit-region.component';
// wifi components
import { WifiComponent } from './components/devices/wifi/wifi.component';
// device location components
import { LocationComponent } from './components/devices/location/location.component';
// modal components:
import { AddContactModalComponent } from './components/contacts/add-contact-modal/add-contact-modal.component';
import { EditContactModalComponent } from './components/contacts/edit-contact-modal/edit-contact-modal.component';
import { TextInputModalComponent } from './components/common/text-input-modal/text-input-modal.component';
// common delete component
import { DeleteItemModalComponent } from './components/common/delete-item-modal/delete-item-modal.component';
// account components
import { BillingInformationComponent } from './components/account/billing-information/billing-information.component';
import { InvoicesComponent } from './components/account/invoices/invoices.component';
import { SubscriptionsComponent } from './components/account/subscriptions/subscriptions.component';
// order components
import { OrderComponent } from './components/order/order.component';
import { OrderProductsComponent } from './components/order/order-products/order-products.component';
import { OrderAuthenticateComponent } from './components/order/order-authenticate/order-authenticate.component';
import { OrderDeliveryComponent } from './components/order/order-delivery/order-delivery.component';
import { OrderPaymentComponent } from './components/order/order-payment/order-payment.component';
// orders for admin
import { OrdersComponent } from './components/admin/orders/orders.component';
import { EditOrderComponent } from './components/admin/orders/edit/edit-order.component';

// product components
import { ProductsComponent } from './components/admin/products/products.component';
import { CreateProductComponent } from './components/admin/products/create/create-product.component';
import { EditProductComponent } from './components/admin/products/edit/edit-product.component';

// check in components
import { CheckInsComponent } from './components/check-in/check-ins.component';
import { CheckInComponent } from './components/check-in/check-in/check-in.component';

// services
import { ValidateService } from './services/validate/validate.service';
import { ApiService } from './services/api/api.service';
import { AuthService } from './services/auth/auth.service';
import { StorageService } from './services/storage/storage.service';
import { ProfileService } from './services/profile/profile.service';
import { AlertService } from './services/alert/alert.service';
import { DeviceService } from './services/device/device.service';
import { ContactService } from './services/contact/contact.service';
import { RegionService } from './services/region/region.service';
import { MapService } from './services/map/map.service';
import { LoadingService } from './services/loading.service';
import { AlarmService } from './services/alarm/alarm.service';
import { AdminService } from './services/admin/admin.service';
import { BillingInfoService } from './services/billing-info/billing-info.service';
import { WifiService } from './services/wifi/wifi.service';
import { InvoiceService } from './services/invoice/invoice.service';
import { SubscriptionService } from './services/subscription/subscription.service';
import { OrderService } from './services/order/order.service';
import { ProductService } from './services/product/product.service';
import { CheckInService } from './services/check-in/check-in.service';
import { DeviceLocationService } from './services/device-location/device.location.service';
import { DevicesComponent } from './components/devices/devices.component';
import { ContactsComponent } from './components/contacts/contacts.component';

const appRoutes: Routes = [
  // { path: '', component: HomeComponent },
  { path: '', redirectTo: 'profiles', pathMatch: 'full'},
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'change-password', component: ChangePasswordComponent },
  { path: 'info', component: UserInfoComponent },

  { path: 'profiles', component: ProfilesComponent },
  { path: 'profile/create', component: CreateProfileComponent },
  { path: 'profile/edit/:profileId', component: EditProfileComponent },

  { path: 'alarms', component: AlarmsComponent },
  { path: 'alarm/:alarmId', component: AlarmComponent },
  { path: 'alarm/info/:alarmId', component: AlarmInfoComponent },

  { path: 'contacts', component: ContactsComponent },

  { path: 'check-ins', component: CheckInsComponent },
  { path: 'check-in/:checkInId', component: CheckInComponent },

  { path: 'devices', component: DevicesComponent },
  { path: 'device/setup/:deviceId', component: SetupDeviceComponent },
  { path: 'device/create', component: CreateDeviceComponent },
  { path: 'device/edit/:deviceId', component: EditDeviceComponent },
  { path: 'device/:deviceId/region/create', component: CreateRegionComponent },
  { path: 'device/:deviceId/region/edit/:regionId', component: EditRegionComponent },

  { path: 'account', component: AccountComponent },
  { path: 'order', component: OrderComponent },

  { path: 'terms-and-conditions', component: TermsAndConditionsComponent },

  { path: 'payment/complete/:orderId', component: PaymentCompleteComponent },
  { path: 'payment/cancelled/:orderId', component: PaymentCancelledComponent },

  // admin routes
  { path: 'admin/orders', component: OrdersComponent },
  { path: 'admin/orders/edit/:orderId', component: EditOrderComponent },

  { path: 'admin/products', component: ProductsComponent },
  { path: 'admin/product/create', component: CreateProductComponent },
  { path: 'admin/product/edit/:productId', component: EditProductComponent },

  { path: 'admin/comms', component: CommsComponent }

];

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    ForgotPasswordComponent,
    RegisterComponent,
    AlertComponent,
    EditProfileComponent,
    CreateProfileComponent,
    ChangePasswordComponent,
    CommsComponent,
    SetupDeviceComponent,
    CreateDeviceComponent,
    EditDeviceComponent,
    CreateRegionComponent,
    EditRegionComponent,
    AddContactModalComponent,
    EditContactModalComponent,
    DeleteItemModalComponent,
    TextInputModalComponent,
    AlarmComponent,
    AlarmsComponent,
    UserInfoComponent,
    LoadingComponent,
    AlarmInfoComponent,
    FooterComponent,
    TermsAndConditionsComponent,
    AccountComponent,
    BillingInformationComponent,
    InvoicesComponent,
    SubscriptionsComponent,
    OrderComponent,
    OrderProductsComponent,
    OrderAuthenticateComponent,
    OrderDeliveryComponent,
    OrderPaymentComponent,
    WifiComponent,
    PaymentCompleteComponent,
    PaymentCancelledComponent,
    ProductsComponent,
    CreateProductComponent,
    EditProductComponent,
    OrdersComponent,
    EditOrderComponent,
    CheckInsComponent,
    CheckInComponent,
    ToggleComponent,
    LocationComponent,
    ProfilesComponent,
    DevicesComponent,
    ContactsComponent
  ],
  entryComponents: [
    AddContactModalComponent,
    EditContactModalComponent,
    DeleteItemModalComponent,
    TextInputModalComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      //{ enableTracing: true } // <-- debugging purposes only
    ),
    BrowserModule,
    BrowserAnimationsModule,
    BsDropdownModule.forRoot(),
    TooltipModule.forRoot(),
    ModalModule.forRoot(),
    CollapseModule.forRoot(),
    FormsModule,
    HttpClientModule,
    IntlTelInputNgModule.forRoot(),
    AngularFontAwesomeModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyCqQpQlfp9EoP-zb9-dML3c1ZdghEDnCq4',
      libraries: ['places']
    }),
    AlertModule.forRoot(),
    ReactiveFormsModule,
    FileUploadModule,
    YoutubePlayerModule
  ],
  providers: [
    ValidateService,
    StorageService,
    AuthService,
    AlertService,
    ProfileService,
    ApiService,
    DeviceService,
    ContactService,
    RegionService,
    MapService,
    LoadingService,
    AlarmService,
    AdminService,
    BillingInfoService,
    WifiService,
    InvoiceService,
    SubscriptionService,
    OrderService,
    ProductService,
    CheckInService,
    DeviceLocationService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
