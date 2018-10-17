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
  @ViewChild('overlap') overlapCanvas: ElementRef;
  @ViewChild(Content) content: Content;
  @ViewChild('headerMenu') header: ElementRef;

  canvasElement: any;
  overlapElement: any;
  lastX: number;
  lastY: number;

  canvasHeight: number;
  canvasWidth: number;

  storedImages = [];
  numCanvases = 0;

  overlapHeight = 20;

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public brushService: BrushProvider) {
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  /*
   * saves canvas, resets drawing page, sets overlap, and goes to final page if 3 drawings done
   */
  nextStep(): void {
    //clear overlap
    let ctx = this.overlapElement.getContext('2d');
    this.clearCanvas(this.overlapElement);

    //get the current canvas as an image, draw it on overlap when loaded
    var img = new Image;
    img.onload = function(){
      ctx.drawImage(img, 0, img.height - 20, img.width, 20, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight); //img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }
    img.src = this.canvasElement.toDataURL();

    //store image in storedImages
    this.storedImages[this.numCanvases] = img;
    this.numCanvases = this.numCanvases + 1;

    this.clearCanvas(this.canvasElement);

    //if we have 3 pictures, we're done --> go to final page, passing in the Images
    if(this.numCanvases == 3){
      this.navCtrl.push(FinalPage, {data: this.storedImages}, {animate:false});
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DrawingPage');
  }

  /*
   * sets the size of the main canvas and overlap canvas
   */
  ngAfterViewInit(){
      this.canvasElement = this.canvas.nativeElement;
      this.overlapElement = this.overlapCanvas.nativeElement;

      var offsetHeight = this.header.nativeElement.offsetHeight + this.overlapHeight + 5; //so it doesn't scroll, subtract header height plus a little more
      this.canvasHeight = this.platform.height() - offsetHeight;
      this.canvasWidth = this.platform.width() - 5;

      this.renderer.setElementAttribute(this.overlapElement, 'width', this.canvasWidth + '');
      this.renderer.setElementAttribute(this.overlapElement, 'height', this.overlapHeight + '');

      this.renderer.setElementAttribute(this.canvasElement, 'width', this.canvasWidth + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.canvasHeight + '');
  }

  /*
   * on first tap, make dot @ location and save x, y
   */
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

  /*
   * on drag, draw line from last x, y to current x, y
   */
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

  clearCanvas(canvas){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

}
