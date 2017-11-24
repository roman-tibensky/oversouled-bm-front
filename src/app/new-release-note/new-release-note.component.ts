/**
 * Created by aRTie on 26/08/2017.
 */


/**
 * Created by aRTie on 20/08/2017.
 */

import {Component, EventEmitter, Output} from '@angular/core';
import { WebService } from '../services/web.service';


@Component({
    selector: 'new-update',
    template: `<h2>Release notes</h2>
    <md-card class="card">
        <md-input-container>
            <input mdInput [(ngModel)]="oneDude" placeholder="Who dunnit?">
        </md-input-container>
        <md-input-container>
            <textarea mdInput [(ngModel)]="oneText" placeholder="Whuh happen?"></textarea>
        </md-input-container>
        
        <md-card-actions>
            <button md-button (click)="sendUpdate()">'member? Yeah, I 'member</button>
        </md-card-actions>
        
    </md-card>

    `
})
export class NewReleaseNotesComponent {
    // private messages: any[];
    private oneText: string;
    private oneDude: string;
    private messages: any[];

    @Output() onPosted = new EventEmitter;

    constructor(
        private webSer: WebService,

    ) {
        this.messages = [];

    }


    async sendUpdate() {
        if (this.oneDude && this.oneDude.trim() !== ''
            && this.oneText && this.oneText.trim() !== ''
        ) {

            const bodyBag = {
                oneMessage: {
                    updateBy: this.oneDude,
                    text: this.oneText
                }
            };

            this.webSer.postMessages(bodyBag);
        }
    }

}
