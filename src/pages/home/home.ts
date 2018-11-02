import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { DrawingPage } from '../drawing/drawing';
import { AuthService } from '../../services/auth.service';
import { LoginPage } from '../login/login';
import { LocalStorageProvider } from '../../providers/image-storage/local-storage';
import { NetworkStorageProvider } from '../../providers/image-storage/network-storage';

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
