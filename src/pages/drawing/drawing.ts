import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../home/home';
import { FinalPage } from '../final/final'

/**
 * Generated class for the DrawingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-drawing',
  templateUrl: 'drawing.html',
})
export class DrawingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goToFinalPage(): void {
    this.navCtrl.setRoot(FinalPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawingPage');
  }

}
