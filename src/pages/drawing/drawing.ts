import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../color-popover/color-popover'
import { FinalPage } from '../final/final'
import { BrushProvider } from '../../providers/brush/brush'


/**
 * Class for the DrawingPage page.
 *
 * Where the user draws their piece of the picture
 */

@IonicPage()
@Component({
  selector: 'page-drawing',
  templateUrl: 'drawing.html',
})

export class DrawingPage {
  @ViewChild('myCanvas') canvas: ElementRef;
  @ViewChild(Content) content: Content;
  @ViewChild('headerMenu') header: ElementRef;

  canvasElement: any;
  lastX: number;
  lastY: number;

  storedImages = [];
  numCanvases = 0;

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public brushService: BrushProvider) {
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  goToFinalPage(): void {
    //get the current canvas as an image
    var img = new Image;
    img.src = this.canvasElement.toDataURL();

    //store image in storedImages
    this.storedImages[this.numCanvases] = img;
    this.numCanvases = this.numCanvases + 1;

    this.clearCanvas();

    if(this.numCanvases == 3){
      this.goToFinalPage();
    }

    //if we have 3 pictures, we're done --> go to final page, passing in the Images
    if(this.numCanvases == 4){
      this.navCtrl.push(FinalPage, {data: this.storedImages}, {animate:false});
    }

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawingPage');
  }

  ngAfterViewInit(){
      this.canvasElement = this.canvas.nativeElement;

      var offsetHeight = this.header.nativeElement.offsetHeight + 10; //so it doesn't scroll, subtract header height plus a little more

      this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() - offsetHeight+ '');
  }

  handleStart(ev){
      var canvasPosition = this.canvasElement.getBoundingClientRect();

      this.lastX = ev.touches[0].pageX - canvasPosition.x;
      this.lastY = ev.touches[0].pageY - canvasPosition.y;

      let ctx = this.canvasElement.getContext('2d');
      ctx.beginPath();
      ctx.arc(this.lastX, this.lastY, this.brushService.size/2, 0, 2 * Math.PI);
      ctx.fillStyle = this.brushService.color;
      ctx.fill();
  }

  handleMove(ev){
      var canvasPosition = this.canvasElement.getBoundingClientRect();

      let ctx = this.canvasElement.getContext('2d');
      let currentX = ev.touches[0].pageX - canvasPosition.x;
      let currentY = ev.touches[0].pageY - canvasPosition.y;

      ctx.beginPath();
      ctx.lineJoin = "round";
      ctx.moveTo(this.lastX, this.lastY);
      ctx.lineTo(currentX, currentY);
      ctx.closePath();
      ctx.strokeStyle = this.brushService.color;
      ctx.lineWidth = this.brushService.size;
      ctx.stroke();

      this.lastX = currentX;
      this.lastY = currentY;
  }

  clearCanvas(){
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

}
