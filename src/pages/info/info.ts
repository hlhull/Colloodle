import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
      title: "Drawn Together",
      description: "<b>Make masterpieces with the people around you!</b> Each player draws one section of a zany hybrid creation. The more ridiculous, the better!",
      image: "assets/img/info-slide-1.png",
    },
    {
      title: "Head, Torso, Body",
      description: "You'll be assigned to draw either the <b>head</b> (face and neck), <b>body</b> (shirt area), or <b>legs</b> (pants and shoes area) of your drawing.",
      image: "assets/img/info-slide-2.png",
    },
    {
      title: "Stay Connected",
      description: "If you're drawing the head or torso, <b>make sure to draw to the bottom of your screen</b>! It helps the next player <b>connect their lines to the previous player's art</b>.",
      image: "assets/img/info-slide-3.png",
    },
    {
      title: "Two Modes of Play",
      description: "Hanging out with some friends? Play with <b>Pass Around</b> to take turns drawing on one device. Flying solo? Login with <b>Connect Mode</b> to play with other users!",
      image: "assets/img/info-slide-4.png",
    }
  ];
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoPage');
  }

}
