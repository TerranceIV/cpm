import { BrowserModule } from '@angular/platform-browser';
// import { ErrorHandler, NgModule } from '@angular/core';
import {  NgModule } from '@angular/core';

// import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { IonicApp, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HttpModule } from '@angular/http';
import { Camera } from '@ionic-native/camera';

import { MyApp } from './app.component';

import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule,AngularFireDatabase  } from 'angularfire2/database';
import { AngularFireStorageModule } from 'angularfire2/storage';

import { UsersDataProvider } from '../providers/users-data/users-data';
import { ProjectDataProvider } from '../providers/project-data/project-data';
import { TaskDataProvider } from '../providers/task-data/task-data';
import * as firebase from 'firebase';
import { GooglePlus } from '@ionic-native/google-plus';

import { IonicImageViewerModule } from 'ionic-img-viewer';

// //for angular calendar
// import { CalendarPage } from '../pages/calendar/calendar';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { CalendarModule ,CalendarDateFormatter, CalendarEventTitleFormatter} from 'angular-calendar';
// import { CalendarWeekHoursViewModule } from 'angular-calendar-week-hours-view';
// import { CustomEventTitleFormatterProvider } from '../providers/custom-event-title-formatter/custom-event-title-formatter';
// import { CustomDateFormatterProvider } from '../providers/custom-date-formatter/custom-date-formatter';



// Initialize Firebase at siswamail
//  var config  = {
//     apiKey: "AIzaSyBmaBkPKOoEYYhoKo7FVvnVNA8K6bhDmW8",
//     authDomain: "fyp-cpm.firebaseapp.com",
//     databaseURL: "https://fyp-cpm.firebaseio.com",
//     projectId: "fyp-cpm",
//     storageBucket: "fyp-cpm.appspot.com",
//     messagingSenderId: "204873076737"
//   };
//   firebase.initializeApp(config );

// Initialize Firebase at terrance072811@gmail.com
  var config = {
    apiKey: "AIzaSyBB6d1sBAn4HOihd9Ijuy9tKjZX8uXDAO4",
    authDomain: "cpm-fyp.firebaseapp.com",
    databaseURL: "https://cpm-fyp.firebaseio.com",
    projectId: "cpm-fyp",
    storageBucket: "cpm-fyp.appspot.com",
    messagingSenderId: "835919196437"
  };
  firebase.initializeApp(config);
  
@NgModule({
  declarations: [
    MyApp,
    // CalendarPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    IonicImageViewerModule
    // CalendarModule.forRoot(),
    // CalendarWeekHoursViewModule,
    // BrowserAnimationsModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    // CalendarPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // {provide: ErrorHandler, useClass: IonicErrorHandler},
    UsersDataProvider,
    ProjectDataProvider,
    InAppBrowser,
    TaskDataProvider,
    GooglePlus,
    Camera,
    AngularFireDatabase,
    // CustomEventTitleFormatterProvider,
    // CustomDateFormatterProvider
  ]
})
export class AppModule {}
