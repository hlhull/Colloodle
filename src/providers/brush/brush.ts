import { Injectable } from '@angular/core';

/*
  Class for the BrushProvider provider.

  Handles options for brush, including size and color
*/
@Injectable()
export class BrushProvider {
  color: string = '#1abc9c';
  styleColor: string = '#1abc9c';
  size: number = 10;

  eraserColor: string = '#ffffff';

  availableColors = [
      '#1abc9c',
      '#3498db',
      '#9b59b6',
      '#e67e22',
      '#e74c3c',
      '#fffc54',
      '#000000'
  ];

  constructor() {
  }

  changeColor(color) {
      this.color = color;
      if (this.color == "#ffffff") {
        this.styleColor = "black";
      } else {
        this.styleColor = color;
      }
  }

  changeSize(sliderState) {
      this.size = sliderState.value;
  }

  reset() {
    this.color = '#1abc9c';
    this.size = 10;
  }

  eraser() {
    this.changeColor(this.eraserColor);
  }

}
