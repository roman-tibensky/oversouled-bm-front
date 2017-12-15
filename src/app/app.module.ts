import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MdTabsModule, MdCardModule, MdInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent }  from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MdToolbarModule } from '@angular/material';
import { MdButtonModule } from '@angular/material';
import { MdSnackBarModule } from '@angular/material';
import { MdDialogModule } from '@angular/material';

import { ReleaseNotesComponent } from './release-notes/release-notes.component';
import { NewReleaseNotesComponent } from './new-release-note/new-release-note.component';
import { NavbarComponent } from './navbar/navbar.component';
import { HomeComponent } from './home/home.component';
import { RegUserComponent } from './account-management/reg-user.component';
import { LoginComponent } from './account-management/login.component';
import { EditUserComponent } from './account-management/edit-user.component';
import { LevelViewComponent } from './level-display/view-level.component';


import { GameOverDialogComponent } from './dialogs/game-over.component';

import { WebService } from './services/web.service';
import { AuthService } from './services/authentication.service';
import { MoveResolutionService } from './services/move-resolution.service';
import { BattleResolutionService } from './services/battle-resolution.service';

import { HttpModule } from '@angular/http';

let routes = [{
        path: '',
        component: HomeComponent
    },
    {
        path: 'release',
        component: ReleaseNotesComponent
    },
    {
        path: 'release/:name',
        component: ReleaseNotesComponent
    },
    {
        path: 'register',
        component: RegUserComponent
    },
    {
        path: 'edit-user',
        component: EditUserComponent
    },
    {
        path: 'login',
        component: LoginComponent
    },
    {
      path: 'new-game',
      component: LevelViewComponent
    }
];

@NgModule({
    imports:      [
        BrowserModule,
        BrowserAnimationsModule,
        HttpModule,
        MdButtonModule,
        MdTabsModule,
        MdCardModule,
        MdInputModule,
        MdSnackBarModule,
        FormsModule,
        ReactiveFormsModule,
        MdToolbarModule,
        MdDialogModule,
        RouterModule.forRoot(routes)
    ],
    declarations: [
        AppComponent,
        HomeComponent,
        ReleaseNotesComponent,
        NewReleaseNotesComponent,
        NavbarComponent,
        RegUserComponent,
        LoginComponent,
        EditUserComponent,
        LevelViewComponent,
        GameOverDialogComponent,
    ],
  entryComponents: [
    GameOverDialogComponent,
  ],
    bootstrap: [
        AppComponent
    ],
    providers: [
        WebService,
        AuthService,
        MoveResolutionService,
        BattleResolutionService
    ]
})
export class AppModule { }
