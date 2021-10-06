import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import * as io from 'socket.io-client';

import { environment } from '../../../../environments/environment';
import { AdminService } from '../../../services/admin/admin.service';

@Component({
    selector: 'comms',
    templateUrl: './comms.component.html',
    styleUrls: ['./comms.component.css'],
    encapsulation: ViewEncapsulation.None,
})
export class CommsComponent implements OnInit {
    private socket;

    public messageCount = 0;
    public comms = [];
    public flashClass = '';
    private maxLength = 100;

    constructor(private adminService: AdminService) {
        this.getCommunications();
        this.connect();
    }

    private getCommunications() {
        this.adminService.getCommunications().subscribe(res => {
            for (let index in res.comms) {
                let comm = res.comms[index];
                this.comms.unshift(comm);
                if (this.comms.length > this.maxLength) {
                    this.comms.pop();
                }
            }
        });
    }

    connect() {
        if (environment.production) {
            this.socket = io();
        } else {
            this.socket = io('localhost:3000');
        }

        this.socket.on('comm', comm => {
            this.messageCount++;

            this.comms.unshift(comm);
            if (this.comms.length > this.maxLength) {
                this.comms.pop();
            }

            this.flashGreen();
        });

        this.socket.on('log', log => {
            this.messageCount++;

            this.comms.unshift({
                received: { log },
                createdAt: new Date()
            });
            if (this.comms.length > this.maxLength) {
                this.comms.pop();
            }

            this.flashGreen();
        });
    }

    flashGreen = function() {
        this.flashClass = 'green';
        setTimeout(() => {
            this.flashClass = '';
        }, 100);
    };

    formatDate = function(val) {
        let date = new Date(val);
        return date.getFullYear() + '/' + 
            this.twoDigitString(date.getMonth()+1) + '/' + 
            this.twoDigitString(date.getDate()) + ' ' + 
            this.twoDigitString(date.getHours()) + ':' + 
            this.twoDigitString(date.getMinutes()) + ':' + 
            this.twoDigitString(date.getSeconds()) + ':' + 
            date.getMilliseconds()
    };

    arrayBufferToString(buff) {
        return String.fromCharCode.apply(null, new Uint8Array(buff));
    }
    
    twoDigitString = function(digit) {
        if (digit < 10) {
            return '0' + digit;
        }
        return digit + '';
    }
    
    syntaxHighlight(json) {
        if (typeof json != 'string') {
            json = JSON.stringify(json, undefined, 2);
        } else {
            json = JSON.parse(json);
            json = JSON.stringify(json, undefined, 4);
        }
        json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            var cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    ngOnInit() {}
}
