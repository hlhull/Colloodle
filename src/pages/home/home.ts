import { Component } from '@angular/core';
import { NavController, PopoverController } from 'ionic-angular';
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
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { StatusBar } from '@ionic-native/status-bar';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, private auth: AuthService, public popoverCtrl: PopoverController, private screenOrientation: ScreenOrientation, private alertCtrl: AlertController, public groupManager: GroupManagerProvider, private statusBar: StatusBar) {
    this.screenOrientation.lock('portrait');
    this.statusBar.show();
  }

  goToInfoPage(){
    this.navCtrl.push(InfoPage);
  }

  /*
    If user is connected to internet and logged in, go to Gallery page
  */
  goToGallery(){
    var userID = firebase.auth().currentUser;

    if (userID == null){ //make sure logged in
      this.presentError(" see your drawings.");
    } else if (!this.groupManager.connected){ //make sure connected to internet
      this.presentDisconnected();
    } else {
      this.navCtrl.push(GroupsPage);
    }
  }

  goToDrawingModesPage(){
    this.navCtrl.push(DrawingModesPage);
  }

  /*
  *Presents the login menu with logout / reset password
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

  /*
  * Causes an alert to popup asking the user to cancel, signup, or login
  */
  presentDisconnected() {
  let alert = this.alertCtrl.create({
    title: 'Error',
    message: 'You must be connected to the internet in to see your drawings.',
    buttons: [
      { text: 'Ok',
        handler: () => {
        }
      }]});
    alert.present();
  }

}
