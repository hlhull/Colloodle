import { ViewController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BrushProvider } from '../../providers/brush/brush'

/*
  Class for the color-popover menu.

  Menu on DrawingPage that allows user to change brush options, using BrushProvider
*/
@Component({
  selector: '.custom-popover',
  templateUrl: 'color-popover.html'
})
// TODO: RENAME
export class PopoverPage {
  constructor(public viewCtrl: ViewController, public brushService: BrushProvider) {}

  // ionViewDidLoad() {
  //   let element = document.getElementById('id')
  //   let parent=element.parentElement
  //   let parent2 = parent.parentElement //popover-content
  //   parent2.parentElement.style['width'] = "92px"
  // }

  close() {
    this.viewCtrl.dismiss();
  }
}
