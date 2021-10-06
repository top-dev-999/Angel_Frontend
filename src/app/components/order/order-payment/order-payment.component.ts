import { Component, Input, OnInit } from "@angular/core";
import { Md5 } from 'ts-md5/dist/md5';

import { LoadingService } from "../../../services/loading.service";
import { AlertService } from "../../../services/alert/alert.service";
import { OrderService } from "../../../services/order/order.service";
import { AuthService } from "../../../services/auth/auth.service";
import { DeviceService } from "../../../services/device/device.service";

@Component({
    selector: "order-payment",
    templateUrl: "./order-payment.component.html",
    styleUrls: ["./order-payment.component.css"]
})
export class OrderPaymentComponent implements OnInit {

    @Input() product: any;
    @Input() billingInfo: any;
    
    public products = [];
    public order = {
        id: '',
        productIds: [],
        amount: 0
    };

    public payfastConfig = {
        // live
        merchantId: '13003844',
        merchantKey: '1jm9k83is4ztj',
        passphrase: 'A3RbzuJGklJCD6mmhQaQ',
        basePath: 'https://payfast.co.za/eng/process?'

        // sandbox
        //merchantId: '10011867',
        //merchantKey: 'fp3h7l0wmv16x',
        //passphrase: 'Test123456test',
        //basePath: 'https://sandbox.payfast.co.za/eng/process?'
    };

    constructor(
        private loadingService: LoadingService,
        private alertService: AlertService,
        private orderService: OrderService,
        private authService: AuthService,
        private deviceService: DeviceService
    ) { }

    ngOnInit() {
        this.products.push(this.product);
        this.order.productIds.push(this.product.id);
        this.order.amount = this.product.price;
    }


    public onPayNow() {
        window.location.href = `/device/create`;

        this.loadingService.show();
        this.orderService.createOrder(this.order).subscribe(res => {
            this.order = res.order;
            //this.navigateToPayfast();
        }, err => {
            this.alertService.alertError('An unexpected error ocurred, please try again later');
            this.loadingService.hide();
        });
    }

    private navigateToPayfast() {
        //alert(this.payfastConfig.basePath + this.getPayfastExtension());
        window.location.href = this.payfastConfig.basePath + this.getPayfastExtension();
    }

    private getPayfastExtension() {
        let payfastObject = this.getValidPayfastObject();
        let payfastKeys = Object.keys(payfastObject);

        let extension = '';
        for (let i in payfastKeys) {
            let key = payfastKeys[i];
            let value = payfastObject[key];

            extension += key + '=' + this.replaceAll(value.trim(), ' ', '+') + '&';
            //extension += key + '=' + this.payFastUrlEncode(value.trim()) + '&';
        }

        extension += 'signature=' + this.generatePayfastSignature();

        return extension;
    }

    private generatePayfastSignature() {
        let payfastObject = this.getValidPayfastObject();
        let payfastKeys = Object.keys(payfastObject);

        let stringToHash = '';
        for (let i in payfastKeys) {
            let key = payfastKeys[i];
            let value = payfastObject[key];

            stringToHash += key + '=' + this.payFastUrlEncode(value.trim()) + '&';
        }

        if (this.payfastConfig.passphrase) {
            stringToHash += 'passphrase=' + this.payfastConfig.passphrase;
        } else {
            stringToHash = stringToHash.substr(0, stringToHash.length - 1); // remove the & at the end
        }
        
        let hash = Md5.hashAsciiStr(stringToHash);
        return hash;
    }

    

    private payFastUrlEncode(value) {
        let dictionary = {
            "%": "%25",
            "!": "%21",
            "#": "%23",
            " ": "+",
            "$": "%24",
            "&": "%26",
            "'": "%27",
            "(": "%28",
            ")": "%29",
            "*": "%2A",
            "+": "%2B",
            ",": "%2C",
            "/": "%2F",
            ":": "%3A",
            ";": "%3B",
            "=": "%3D",
            "?": "%3F",
            "@": "%40",
            "[": "%5B",
            "]": "%5D"
        };

        var res = '';

        for (let i in value) {
            let char = value[i];
            if (dictionary[char]) {
                res += dictionary[char]
            } else {
                res += char;
            }
        }

        return res;
    }

    private getValidPayfastObject() {
        
        let payfast: any = {};

        payfast.merchant_id = this.payfastConfig.merchantId;
        payfast.merchant_key = this.payfastConfig.merchantKey;

        payfast.return_url = `https://devices.angelasp.co.za/payment/complete/${this.order.id}`;
        payfast.cancel_url = `https://devices.angelasp.co.za/payment/cancelled/${this.order.id}`;
        payfast.notify_url = 'https://devices.angelasp.co.za/api/order/payment';
        
        let account = this.authService.getAccount();
        if (this.billingInfo && account) {
            payfast.name_first = this.billingInfo.name;
            payfast.name_last = this.billingInfo.surname;
            payfast.email_address = account.email;
            payfast.cell_number = this.billingInfo.cellphone.replace('+27', '0');
        }
        
        payfast.m_payment_id = this.order.id;
        
        payfast.amount = this.product.price.toString();
        payfast.item_name = this.product.name;
        //payfast.item_description = '';

        payfast.subscription_type = '1';
        payfast.billing_date = this.getBillingDate();
        payfast.recurring_amount = this.product.monthlyPrice.toString();
        payfast.frequency = '3';
        payfast.cycles = '0';
        
        return payfast;
    }

    private getBillingDate() {
        let now = new Date();
        let month = now.getMonth();
        if (month == 11) {
            return `${now.getFullYear() + 1}-01-01`;
        } else {
            return `${now.getFullYear()}-${this.twoDigitString(month + 2)}-01`;
        }
    }

    private twoDigitString(digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }

    private replaceAll(target, search, replacement) {
        return target.split(search).join(replacement);
    };
}
