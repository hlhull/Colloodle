import { Component, ViewChild } from '@angular/core';
// import { Platform } from 'ionic-angular';
import { App, MenuController, Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
import { HomePage } from '../pages/home/home';
import { AuthService } from '../services/auth.service';

import * as firebase from 'firebase';
import { config } from '../config';

// Made with some help from tutorial:
// https://medium.com/appseed-io/integrating-firebase-password-and-google-authentication-into-your-ionic-3-app-2421cee32db9


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  // rootPage:any = LoginPage;
  rootPage:any = HomePage;

  @ViewChild(Nav) nav: Nav;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private auth: AuthService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      // this.initializeApp();
    });
    // firebase.initializeApp(config); //REMOVED AFTER ADDING LOGIN PAGE, CAN'T INITALIZE MORE THAN ONCE
  }

  // initializeApp() {
    // this.platform.ready().then(() => {
    //   this.statusBar.styleDefault();
    // });

    // this.auth.afAuth.authState
    //   .subscribe(
    //     user => {
    //       if (user) {
    //         this.rootPage = HomePage;
    //       } else {
    //         this.rootPage = LoginPage;
    //       }
    //     },
    //     () => {
    //       this.rootPage = LoginPage;
    //     }
    //   );
  // }

}
