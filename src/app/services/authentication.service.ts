/**
 * Created by aRTie on 09/09/2017.
 */

import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
    // BASE_URL = 'https://oversouled-back-dev-romantibensky.c9users.io/';
    BASE_URL = 'https://oversouled-back.eu-gb.mybluemix.net/';

    constructor(
        private http: Http,
        private router: Router
    ) {}

    get name(){
        return localStorage.getItem('user');
    }

    get isAuthenticated() {
        return localStorage.getItem('token');
    }

    get tokenHeader() {
        let header = new Headers({'Authorization': 'Bearer ' + localStorage.getItem('token')});
        return new RequestOptions({ headers: header});
    }


    register(newUser) {
        delete newUser.rePass;
        this.http.post(this.BASE_URL + 'auth/register', newUser).subscribe(res => {

            let results = res.json();
            if (!results.tuhken) {
                return;
            }

            localStorage.setItem('token', results.tuhken);
            localStorage.setItem('user', results.user);

            this.router.navigate(['/']);
        });
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }

    login(reg) {
        this.http.post(this.BASE_URL + 'auth/login', reg).subscribe(res => {
            let resJson = res.json()
            console.log(res);
            console.log(resJson.success);
            if (resJson.success) {
                localStorage.setItem('token', resJson.tuhken);
                localStorage.setItem('user', resJson.user);
                this.router.navigate(['/']);
            }
        });
    }

}
