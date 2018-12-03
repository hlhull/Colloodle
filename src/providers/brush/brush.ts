import { Injectable } from '@angular/core';

/*
  Class for the BrushProvider provider.

  Handles options for brush, including size and color
*/
@Injectable()
export class BrushProvider {
  color: string = '#fffc54';
  styleColor: string = '#fffc54';
  size: number = 10;

  eraserColor: string = '#ffffff';

  eraserClicked: boolean = false;

  availableColors = [
      '#e74c3c',
      '#e67e22',
      '#fffc54',
      '#16e554',
      '#1abc9c',
      '#87d7e5',
      '#3498db',
      '#380cb2',
      '#9b59b6',
      '#ffaab7',
      '#775035',
      '#c6c6c6',
      '#000000'
  ];

  constructor() {
  }

  changeColor(color) {
      this.color = color;
      this.styleColor = color;
  }

  changeSize(sliderState) {
      this.size = sliderState.value;
  }

  reset() {
    this.color = '#fffc54';
    this.size = 10;
    this.styleColor = '#fffc54';
    this.eraserClicked = false;
  }

  changePaint(color) {
    this.eraserClicked = false;
    this.changeColor(color);
  }

  changeToEraser() {
    this.eraserClicked = true;
    this.changeColor(this.eraserColor);
  }

}
