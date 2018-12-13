import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FriendsStorageProvider } from '../../providers/image-storage/friends-storage';
import { DrawingPage } from '../drawing/drawing';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { HomePage } from '../home/home';
import { UserPopoverPage } from '../user-popover/user-popover';
import { AlertController } from 'ionic-angular';
import firebase from 'firebase';

/**
 * Generated class for the FriendsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-friends',
  templateUrl: 'friends.html',
})
export class FriendsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider, private screenOrientation: ScreenOrientation, private auth: AuthService, public popoverCtrl: PopoverController, private alertCtrl: AlertController) {
    this.screenOrientation.unlock();
  }

  /*
    if user is signed in and connected to internet, and no conflict in group,
    go to drawing page for that group
  */
  drawGroup(group, conflict){
    var userID = firebase.auth().currentUser;

    if(userID == null){ //user isn't signed in, but wants to do a random drawing --> popup telling them to sign in!!!
      this.presentErrorSignIn(" draw with Friends");
    } else if (!conflict && this.groupManager.connected){
      var imageStorage = new FriendsStorageProvider(group);
      this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
    } else {
      this.presentErrorConnect(" Friends mode");
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
  }

  /*
   Presents the login menu with logout / reset password
  */
  presentUserPopover(myEvent) {
    let popover = this.popoverCtrl.create(UserPopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  goToHome(){
    this.navCtrl.push(HomePage);
  }

  goBack(){
    this.navCtrl.pop();
  }

  /*
   sends the user to login page (also signs out if already signed in,
   even though you shouldn't be, just in case)
  */
  login() {
    this.auth.signOut();
    this.navCtrl.push(LoginPage);
  }

  /*
   signs you out; this automatically removes the logout button and user/email
   header, since the html checks if you are logged in or not
  */
  logout() {
    this.auth.signOut();
  }

  /*
  * Causes an alert to popup asking the user to cancel, signup, or login
  */
  presentErrorSignIn(actionString) {
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
    Causes an alert to popup telling the user they must connect to the internet
    to continue
  */
  presentErrorConnect(mode){
    let alert = this.alertCtrl.create({
      title: 'Error',
      message: 'You must be connected to the internet to enter '+ mode,
      buttons: [
        { text: 'Ok',
          role: 'cancel',
          handler: () => {}
        }
      ]});
    alert.present();
  }

}
