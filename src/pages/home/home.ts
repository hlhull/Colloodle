import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { DrawingPage } from '../drawing/drawing';
import { DrawingLandscapePage } from '../drawing-landscape/drawing-landscape';


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

  constructor(public navCtrl: NavController) {

  }

}
