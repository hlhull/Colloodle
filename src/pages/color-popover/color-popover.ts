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
        <h2 ion-text [style.color]="this.brushService.styleColor">Brush Options</h2>
        <button ion-button icon-only (click)="this.close()" style="float: right;" color="dark" clear>
          <ion-icon name="close" align="right"></ion-icon>
        </button>
      </ion-list-header>
      <button *ngFor="let color of this.brushService.availableColors" icon-only ion-button clear (click)="this.brushService.changeColor(color)">
          <ion-icon [style.color]="color" name="square"></ion-icon>
      </button>
      <button ion-button outline small (click)="this.brushService.eraser()">Eraser</button>
      <ion-item>
        <ion-range min="1" max="100" [style.color]="this.brushService.styleColor" [(ngModel)]="this.brushService.size" (ionChange)="this.brushService.changeSize($event)">
          <ion-icon range-left style="font-size: 1em;" name="radio-button-on"></ion-icon>
          <ion-icon range-right style="font-size: 2em;" name="radio-button-on"></ion-icon>
        </ion-range>
      </ion-item>
    </ion-list>
  `
})
// TODO: RENAME
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public brushService: BrushProvider) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
