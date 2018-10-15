import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';

/**
 * Generated class for the FinalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-final',
  templateUrl: 'final.html',
})
export class FinalPage {
  @ViewChild('myCanvas') canvas: any;
  picture: any;
  canvasElement: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer) {
    this.picture = navParams.get('data'); //canvas passed from DrawingPage
  }

  ngAfterViewInit(){
      //set the canvas (myCanvas) width / heigh
      this.canvasElement = this.canvas.nativeElement;
      this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');

      //draw on canvas the canvas that was passed from DrawingPage
      let ctx = this.canvasElement.getContext('2d');
      ctx.drawImage(this.picture, 0, 0);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }

}
