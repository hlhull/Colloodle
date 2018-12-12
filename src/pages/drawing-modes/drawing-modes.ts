import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { DrawingPage } from '../drawing/drawing';
import { HomePage } from '../home/home';
import { PassAroundStorageProvider } from '../../providers/image-storage/pass-around-storage';
import { RandomStorageProvider } from '../../providers/image-storage/random-storage';
import { AlertController } from 'ionic-angular';
import { UserPopoverPage } from '../user-popover/user-popover';
import { LoginPage } from '../login/login';
import { SignupPage } from '../signup/signup';
import { FriendsPage } from '../friends/friends';
import * as firebase from 'firebase';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';

/**
 * Generated class for the DrawingModesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-drawing-modes',
  templateUrl: 'drawing-modes.html',
})
export class DrawingModesPage {

  passAroundDetailsVisible = false;
  randomDetailsVisible = false;
  friendsDetailsVisible = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService, private screenOrientation: ScreenOrientation, private alertCtrl: AlertController, public popoverCtrl: PopoverController, private groupManager: GroupManagerProvider) {
    this.screenOrientation.unlock();
  }

  togglePassAroundDetails() {
    this.passAroundDetailsVisible = !this.passAroundDetailsVisible;
  }

  toggleRandomDetails() {
    this.randomDetailsVisible = !this.randomDetailsVisible;
  }

  toggleFriendsDetails() {
    this.friendsDetailsVisible = !this.friendsDetailsVisible;
  }

  goToPassAround(){
    var imageStorage = new PassAroundStorageProvider();
    this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
  }

  goToRandom(){
    var userID = firebase.auth().currentUser;

    if(userID == null){ //user isn't signed in, but wants to do a random drawing --> popup telling them to sign in!!!
      this.presentErrorSignIn(" enter Random mode");
    } else if (this.groupManager.connected){
      var imageStorage = new RandomStorageProvider();
      this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
    } else {
      this.presentErrorConnect(" Random mode");
    }
  }

  goToFriends(){
    var userID = firebase.auth().currentUser;

    if(userID == null){ //user isn't signed in, but wants to do a random drawing --> popup telling them to sign in!!!
      this.presentErrorSignIn(" draw with Friends");
    } else if (this.groupManager.connected){
      var imageStorage = new RandomStorageProvider();
      this.navCtrl.push(FriendsPage, {animate:false});
    } else {
      this.presentErrorConnect(" Friends mode");
    }
  }

  goToHome(){
    this.navCtrl.push(HomePage);
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


  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawingModesPage');
  }

}
