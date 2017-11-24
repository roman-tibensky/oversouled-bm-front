/**
 * Created by aRTie on 27/08/2017.
 */


import { Component } from '@angular/core';
// import { ReleaseNotesComponent } from './release-notes/release-notes.component';

@Component({
    selector: 'home',
    template: `
        <!---<new-update></new-update>
        <release-notes></release-notes> -->
      <view-level></view-level>
    `,
})
export class HomeComponent  {
    name = 'stuff';

}
