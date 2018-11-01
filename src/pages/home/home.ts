import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, PopoverController } from 'ionic-angular';
import { DrawingPage } from '../drawing/drawing';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { UserPopoverPage } from '../user-popover/user-popover';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  /*
    goes to drawing page, passing in either 'true' for local if user clicked pass-Around
    and 'false' for local storage if user clicked random (need to store on network)
  */
  goToDrawingPage(type): void {
    if(type == 'pass-around'){
      this.navCtrl.push(DrawingPage, {local: true}, {animate:false});
    } else {
      this.navCtrl.push(DrawingPage, {local: false, group: 'group#', section: '2'}, {animate:false});
    }
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
