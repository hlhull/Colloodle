import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, PopoverController } from 'ionic-angular';
import { DrawingPage } from '../drawing/drawing';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { LocalStorageProvider } from '../../providers/image-storage/local-storage';
import { NetworkStorageProvider } from '../../providers/image-storage/network-storage'
import { UserPopoverPage } from '../user-popover/user-popover';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /*
    goes to drawing page, passing correct storage provider type: 'true' for local
    if user clicked pass-Around and 'false' for network storage if user clicked random
  */
  goToDrawingPage(local){
    var imageStorage = local ? new LocalStorageProvider() : new NetworkStorageProvider();
    this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
  }

  // @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, private auth: AuthService, public popoverCtrl: PopoverController) {

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
  	this.navCtrl.setRoot(LoginPage);
  }

  /*
  * signs you out; this automatically removes the logout button and user/email
  * header, since the html checks if you are logged in or not
  */
  logout() {
  	this.auth.signOut();
  	// this.navCtrl.setRoot(LoginPage);
  }

}
