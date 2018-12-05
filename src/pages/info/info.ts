import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { HomePage} from '../home/home';
import { DrawingModesPage } from '../drawing-modes/drawing-modes';

/**
 * Generated class for the InfoPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 *
 * code from ionic-preview-app
 *
 */

@IonicPage()
@Component({
  selector: 'page-info',
  templateUrl: 'info.html',
})
export class InfoPage {
  slides = [
    {
      title: "Colloodling 101",
      description: "Colin and I will be working together to show you how to play! Keep swiping to learn more.",
      image: "assets/imgs/info-slide-0.png",
    },
    {
      title: "Drawn Together",
      description: "<b>Make masterpieces with the people around you!</b> Each player draws one section of a zany hybrid creation. The more ridiculous, the better!",
      image: "assets/imgs/info-slide-1.png",
    },
    {
      title: "Head, Torso, Body",
      description: "You'll be assigned to draw either the <b>head</b> and neck, <b>torso</b> (shirt area), or <b>legs</b> (pants and shoes area) of your drawing. Make sure to <b>draw to the bottom</b> of the canvas and connect to the top!",
      image: "assets/imgs/info-slide-2.png",
    },
    {
      title: "Colors, Buttons, and Canvas, Oh My!",
      description: "Here's the canvas! I automatically rotate your screen horizontal to give you more room to create your masterpiece.",
      image: "assets/imgs/info-slide-3.png",
    },
    {
      title: "Three Modes of Play",
      description: "When you click on <b>Doodle</b> on the home page, you'll be able to read more info about each of these modes.",
      image: "assets/imgs/info-slide-4.png",
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goToDrawingModesPage(): void {
    this.navCtrl.setRoot(DrawingModesPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
