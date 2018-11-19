import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, PopoverController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { DrawingModesPage } from '../drawing-modes/drawing-modes';
import { UserPopoverPage } from '../user-popover/user-popover';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AlertController } from 'ionic-angular';
import * as firebase from 'firebase';
import { InfoPage } from '../info/info';
import { GroupsPage } from '../groups/groups';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {



  goToInfoPage(){
    this.navCtrl.push(InfoPage);
  }

  // @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, private auth: AuthService, public popoverCtrl: PopoverController, private screenOrientation: ScreenOrientation, private alertCtrl: AlertController) {
    this.screenOrientation.lock('portrait');
  }

  goToGallery(){
    var userID = firebase.auth().currentUser;
    if (userID == null){
      this.presentError(" see your drawings.");
    } else {
      this.navCtrl.push(GroupsPage);
    }
  }

  goToDrawingModesPage(){
    this.navCtrl.push(DrawingModesPage);
  }

  /*
  *Presents the popover menu with color and brush size
  */
  presentUserPopover(myEvent) {
    let popover = this.popoverCtrl.create(UserPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  /*
  * sends the user to login page (also signs out if already signed in,
  * even though you shouldn't be, just in case)
  */
  login() {
  	this.auth.signOut();
  	this.navCtrl.push(LoginPage);
  }

  /*
  * signs you out; this automatically removes the logout button and user/email
  * header, since the html checks if you are logged in or not
  */
  logout() {
  	this.auth.signOut();
  	// this.navCtrl.push(LoginPage);
  }

  /*
  * Causes an alert to popup asking the user to cancel, signup, or login
  */
  presentError(actionString) {
  let alert = this.alertCtrl.create({
    title: 'Error',
    message: 'You must be signed in to '+ actionString,
    buttons: [
      { text: 'Login',
        handler: () => {
          this.navCtrl.push(LoginPage);
        }
      },
      { text: 'Sign Up',
        handler: () => {
          this.navCtrl.push(SignupPage);
        }
      },
      { text: 'Cancel',
        role: 'cancel',
        handler: () => {}
      }
    ]});
  alert.present();
}

}
