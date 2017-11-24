/**
 * Created by aRTie on 29/08/2017.
 */


import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/authentication.service'

@Component({
    moduleId: module.id,  // specifies path
    selector: 'reg-user',
    templateUrl: `./reg-user.component.html`,
    styles: [`
        .error {
            background-color: #FFF0F0;
        }
    `]
})
export class RegUserComponent  {
    form;

    constructor(
        private formBuilder: FormBuilder,
        private auth: AuthService
    ) {
        this.form = this.formBuilder.group({
            user: ['', Validators.required],
            email: ['', [Validators.required, isEmailvalid()]],
            pass: ['', Validators.required],
            rePass: ['', Validators.required],
        }, {validator: areFieldsMatching('pass', 'rePass')}
        );

    }


    onSubmit() {
        console.log(this.form.value);
        console.log(this.form.errors);
        this.auth.register(this.form.value);
    }

    isValid(thingy) {
        return this.form.controls[thingy].invalid && this.form.controls[thingy].touched;
    }

}

function areFieldsMatching(specimenA, specimenB) {
    return form => {
        if (form.controls[specimenA].value !== form.controls[specimenB].value) {
            return { isNotMatching: true };
        }
    };
}

// Validators actually need to return a function... they aren't just the function that does the validating...
function isEmailvalid() {
    return control => {
        let regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        return regex.test(control.value) ? null : {invalidEmail: true};
    };
}
