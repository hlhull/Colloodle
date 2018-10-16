import { Injectable } from '@angular/core';

/*
  Generated class for the BrushProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class BrushProvider {
  color: string = '#1abc9c';
  size: number = 10;

  availableColors = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c'
  ];

  constructor() {

  }

  changeColor(color){
      this.color = color;
      console.log(this.color);
  }

  changeSize(size){
      this.size = size;
  }


}
