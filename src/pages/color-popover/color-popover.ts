import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BrushProvider } from '../../providers/brush/brush'

@Component({
  template: `
    <ion-list>
      <ion-list-header>Ionic</ion-list-header>
      <button *ngFor="let color of this.brushService.availableColors" icon-only ion-button (click)="this.brushService.changeColor(color)">
          <ion-icon [style.color]="color" name="brush"></ion-icon>
      </button>
      <ion-item>
        <ion-range min="0" max="100" [(ngModel)]="saturation" color="secondary">
          <ion-label range-left>0</ion-label>
          <ion-label range-right>100</ion-label>
        </ion-range>
      </ion-item>
      <button ion-item (click)="close()">Showcase</button>
      <button ion-item (click)="close()">GitHub Repo</button>
    </ion-list>
  `
})
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public brushService: BrushProvider) {}

  close() {
    this.viewCtrl.dismiss();
  }
}
