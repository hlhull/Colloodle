import { Injectable } from '@angular/core';

/*
  Class for the BrushProvider provider.

  Handles options for brush, including size and color
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
      '#e74c3c',
      '#ffffff'
  ];

  constructor() {}

  changeColor(color){
      this.color = color;
  }

  changeSize(sliderState){
      this.size = sliderState.value;
  }

}
