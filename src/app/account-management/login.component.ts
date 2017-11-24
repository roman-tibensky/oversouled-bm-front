/**
 * Created by aRTie on 09/09/2017.
 */

import { Component } from '@angular/core';
import { AuthService } from '../services/authentication.service';

@Component({
    selector: 'login',
    template: `
        <md-card>
            <md-input-container>
                <input mdInput [(ngModel)]="reg.user" placeholder="username">
            </md-input-container>
            <md-input-container>
                <input mdInput type="password" [(ngModel)]="reg.pass" placeholder="password">
            </md-input-container>
            <button md-button md-raised-button color="primary" (click)="auth.login(reg)">Login</button>
        </md-card>
    `
})

export class LoginComponent {
    reg;
    constructor(
        private auth: AuthService
    ) {
        this.reg = {
            user: '',
            pass: ''
        };
    }
}
