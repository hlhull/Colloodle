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

  goToDrawingPage(): void {
    this.navCtrl.setRoot(DrawingPage);
  }

  goToDrawingLandscapePage(): void {
    this.navCtrl.setRoot(DrawingLandscapePage);
  }

  // @ViewChild(Nav) nav: Nav;

  constructor(public navCtrl: NavController, private auth: AuthService) {

  }

  // login() {
  //   // this.menu.close();
  // 	this.auth.signOut();
  // 	this.navCtrl.setRoot(LoginPage);
  // }

  logout() {
  	// this.menu.close();
  	this.auth.signOut();
  	this.navCtrl.setRoot(LoginPage);
  }

}
