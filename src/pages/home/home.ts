import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { DrawingPage } from '../drawing/drawing';
import { DrawingLandscapePage } from '../drawing-landscape/drawing-landscape';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';

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

  goToDrawingLandscapePage(): void {
    this.navCtrl.setRoot(DrawingLandscapePage);
  }

  // @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, private auth: AuthService) {

  }

  login() {
  	this.auth.signOut();
  	this.navCtrl.setRoot(LoginPage);
  }

  logout() {
  	this.auth.signOut();
  	// this.navCtrl.setRoot(LoginPage);
  }

}
