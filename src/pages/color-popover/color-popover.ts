import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BrushProvider } from '../../providers/brush/brush'

/*
  Class for the color-popover menu.

  Menu on DrawingPage that allows user to change brush options, using BrushProvider
*/
@Component({
  template: `
    <ion-list>
      <ion-list-header>
        Brush Options
        <button icon-only ion-button (click)="this.close()" style="float: right;" color="dark" clear>
          <ion-icon name="close" align="right"></ion-icon>
        </button>
      </ion-list-header>
      <button *ngFor="let color of this.brushService.availableColors" icon-only ion-button color="light" (click)="this.brushService.changeColor(color)">
          <ion-icon [style.color]="color" name="brush"></ion-icon>
      </button>
      <ion-item>
        <ion-range min="1" max="100" color="primary" [(ngModel)]="this.brushService.size" (ionChange)="this.brushService.changeSize($event)">
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
