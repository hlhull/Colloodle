import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController } from 'ionic-angular';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { FriendsStorageProvider } from '../../providers/image-storage/friends-storage';
import { DrawingPage } from '../drawing/drawing';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { HomePage } from '../home/home';
import { UserPopoverPage } from '../user-popover/user-popover';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, private groupManager: GroupManagerProvider, private screenOrientation: ScreenOrientation, private auth: AuthService, public popoverCtrl: PopoverController) {
    this.screenOrientation.unlock();
  }

  drawGroup(group, conflict){
    if(!conflict){
      var imageStorage = new FriendsStorageProvider(group);
      this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FriendsPage');
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

  goToHome(){
    this.navCtrl.push(HomePage);
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

}
