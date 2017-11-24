/**
 * Created by aRTie on 04/11/2017.
 */


import { Component, OnInit, Input, Output, OnChanges, EventEmitter, Inject } from '@angular/core';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { MD_DIALOG_DATA } from '@angular/material';
import { MdDialogRef } from '@angular/material';

@Component({
  selector: 'game-over',
  template: `
    <div align="center">
      <b><i>You were scattered to the winds</i></b>
      <br>
      <b><i>Like a scream that never was</i></b>
      <br>
      <br>
      <button md-button md-raised-button class="redButton" (click)="close()"><b><i>I will never stop</i></b></button>
    </div>
  `,
  animations: [
    trigger('dialog', [
      transition('void => *', [
        style({ transform: 'scale3d(.3, .3, .3)' }),
        animate(100)
      ]),
      transition('* => void', [
        animate(100, style({ transform: 'scale3d(.0, .0, .0)' }))
      ])
    ])
  ]
})
export class GameOverDialogComponent implements OnInit {
  @Input() closable = true;
  @Input() visible: boolean;
  @Output() visibleChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public thisDialogRef: MdDialogRef<GameOverDialogComponent>, @Inject(MD_DIALOG_DATA) public data: string) { }


  ngOnInit() { }

  close() {
    this.thisDialogRef.close('Confirm');
  }
}
