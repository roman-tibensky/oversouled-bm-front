 import { Component } from '@angular/core';
// import { ReleaseNotesComponent } from './release-notes/release-notes.component';



@Component({
  selector: 'my-app',
  template: `
      <navi-ish-thing></navi-ish-thing>
      <router-outlet></router-outlet>
      <log-display></log-display>
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent  {
    name = 'stuff';

}
