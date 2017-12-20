/**
 * Created by Roman T on 12/20/2017.
 */


import {Component, OnInit } from '@angular/core';
import { MoveResolutionService } from '../services/move-resolution.service';

@Component({
    moduleId: module.id,  // specifies path
    selector: 'log-display',
    templateUrl: `./log-display.component.html`,

})


export class LogDisplayComponent implements OnInit {

    logList = [];

    constructor(private moveSer: MoveResolutionService){

    }

    ngOnInit() {
        this.moveSer.currentMessage.subscribe(message => this.processMessages(message))
    }

    processMessages(messsage) {
      const newMessages = messsage.split('#');

        switch (newMessages[0]) {
            case 'add':
                for (let i = 1; i < newMessages.length; i++){
                    this.logList.unshift(newMessages[i]);
                }

                this.logList = this.logList.slice(0, 100);
                break;
            case 'delete':
                this.logList = [];
                break;
            default:
                this.logList.unshift('error reading message');
                this.logList = this.logList.slice(0, 100);
        }
    }



}
