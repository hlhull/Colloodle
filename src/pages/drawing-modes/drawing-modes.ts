import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { DrawingPage } from '../drawing/drawing';
import { PassAroundStorageProvider } from '../../providers/image-storage/pass-around-storage';
import { RandomStorageProvider } from '../../providers/image-storage/random-storage';
import * as firebase from 'firebase';


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

  constructor(public navCtrl: NavController, public navParams: NavParams, private auth: AuthService) {
  }

  /*
    goes to drawing page, passing correct storage provider type: 'true' for local
    if user clicked pass-Around and 'false' for network storage if user clicked random
  */
  goToDrawingPage(local){
    var userID = firebase.auth().currentUser;
    if(userID == null && local == false){ //user isn't signed in, but wants to do a random drawing --> popup telling them to sign in!!!
      this.presentError(" enter Random mode");
    } else {
      var imageStorage = local ? new PassAroundStorageProvider() : new RandomStorageProvider();
      this.navCtrl.push(DrawingPage, {imageStorage: imageStorage}, {animate:false});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawingModesPage');
  }

}
