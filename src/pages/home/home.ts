import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { DrawingPage } from '../drawing/drawing';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  goToDrawingPage(): void {
    this.navCtrl.setRoot(DrawingPage);
  }
  constructor(public navCtrl: NavController) {

  }

}
