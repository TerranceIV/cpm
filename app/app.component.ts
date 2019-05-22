import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
// import { CalendarPage } from '../pages/calendar/calendar';
import * as firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp { 
  
  rootPage:string= 'DefaultPage';
  
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {


    firebase.auth().onAuthStateChanged( (user) => {
      
      if (user!==null) {
          // console.log("app login");
          this.rootPage = 'NavigationPage';
             
      } else {
          // console.log("not login");
          this.rootPage = 'DefaultPage';
        
      } 
    })
  
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
 
   
    
  }

}

