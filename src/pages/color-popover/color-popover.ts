import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BrushProvider } from '../../providers/brush/brush'

@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button *ngFor="let color of this.brushService.availableColors" icon-only ion-button color="light" (click)="this.brushService.changeColor(color)">
          <ion-icon [style.color]="color" name="brush"></ion-icon>
      </button>
      <ion-item>
        <ion-range min="1" max="100" color="primary" (ionChange)="this.brushService.changeSize($event)">
          <ion-icon range-left style="font-size: 1em;" name="radio-button-on"></ion-icon>
          <ion-icon range-right style="font-size: 2em;" name="radio-button-on"></ion-icon>
        </ion-range>
      </ion-item>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public brushService: BrushProvider) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
