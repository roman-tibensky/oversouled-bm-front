/**
 * Created by aRTie on 29/08/2017.
 */


import {Component, OnInit} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import {WebService} from '../services/web.service';

@Component({
    moduleId: module.id,  // specifies path
    selector: 'edit-user',
    templateUrl: `./edit-user.component.html`,
    styles: [`
        .error {
            background-color: #FFF0F0;
        }
    `]
})
export class EditUserComponent implements OnInit {
    form;

    constructor(
        private formBuilder: FormBuilder,
        private webSer: WebService
    ) {
        this.form = this.formBuilder.group({
                firstName: ['', Validators.required],
                lastName: ['', [Validators.required]],
            }
        );

    }

    ngOnInit(): void {
        this.webSer.getUser().subscribe(res => {
            this.form.value.firstName = res.firstName;
            this.form.value.lastName = res.lastName;
        });
    }


    onSubmit() {
        console.log(this.form.value);
        console.log(this.form.errors);
        this.webSer.saveUser(this.form.value).subscribe(res => console.log(res));
    }



}

