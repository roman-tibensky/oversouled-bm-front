/**
 * Created by aRTie on 20/08/2017.
 */

import { Component, OnInit } from '@angular/core';
import { WebService } from '../services/web.service';
import { ActivatedRoute } from '@angular/router';
import { NgStyle } from '@angular/common';

@Component({
    selector: 'release-notes',
    templateUrl: './release-notes.component.html'
})
export class ReleaseNotesComponent implements OnInit {


    constructor(
        private webSer: WebService,
        private route: ActivatedRoute
    ) {

    }

    ngOnInit() {
        //this.webSer.getUser().subscribe(res => console.log(res));
        this.webSer.getMessages(this.route.snapshot.params.name);
        // this.webSer.messages.subscribe(messages => {
        //     this.messages = messages;
        // });
    }

}
