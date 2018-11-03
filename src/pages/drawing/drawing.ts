import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../color-popover/color-popover'
import { FinalPage } from '../final/final';
import { BrushProvider } from '../../providers/brush/brush';
import { AlertController } from 'ionic-angular';
import { NetworkStorageProvider } from '../../providers/image-storage/network-storage'

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

  canvasElement: any;
  overlapElement: any;
  lastX: number;
  lastY: number;

  canvasHeight: number;
  canvasWidth: number;

  undoStack = [new Image];
  redoStack = []; //TypeScript [] appears to have push/pop stack functionality? Yay!

  overlapHeight = 20;
  imageStorage;

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public brushService: BrushProvider, private alertCtrl: AlertController) {
    this.imageStorage = navParams.get('imageStorage');
  }

  goHome(): void {
    this.presentConfirm();
  }

  /*
   * saves canvas, resets page, sets overlap, and goes to final page if 3 drawings done
   */
  nextStep(): void {
    //get the current canvas as an image, draw it on overlap when loaded
    var img = new Image();
    img.src = this.canvasElement.toDataURL(); //saving current image in cavas

    //store image
    if(this.imageStorage instanceof NetworkStorageProvider){
      this.imageStorage.updateGroup().then(() => this.imageStorage.storeImage(img.src).then((proceed) => {
        console.log(proceed)
        if(proceed){
          this.navCtrl.push(FinalPage, {imageStorage: this.imageStorage, landscape: false}, {animate:false});
        }
      }));
    } else {
      var proceed = this.imageStorage.storeImage(img.src);
      if(proceed){
          this.navCtrl.push(FinalPage, {imageStorage: this.imageStorage, landscape: false}, {animate:false});
        }
    }

    this.resetPage();

    this.drawOverlap(img);
  }

  drawOverlap(img){
    let ctx = this.overlapElement.getContext('2d');
    var overlap = this.overlapHeight;
    if(img == null){
      var promise = this.imageStorage.getOverlap();
      img = new Image();
      if (promise != null) {
        promise.then((imgUrl) => img.src = imgUrl);
      }
    }

    img.onload = function(){  //draws in the overlap bar:
      ctx.drawImage(img, 0, img.height - overlap, img.width, overlap, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight); //img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
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

      //var offsetHeight = this.header.nativeElement.offsetHeight + document.getElementById("bottom-toolbar").offsetHeight + this.overlapHeight; //so it doesn't scroll, subtract header and footer height
      this.canvasHeight = this.platform.height() - this.overlapHeight;
      this.canvasWidth = this.platform.width() *.9 -4;

      this.renderer.setElementAttribute(this.overlapElement, 'width', this.canvasWidth + '');
      this.renderer.setElementAttribute(this.overlapElement, 'height', this.overlapHeight + '');

      this.renderer.setElementAttribute(this.canvasElement, 'width', this.canvasWidth + '');
      this.renderer.setElementAttribute(this.canvasElement, 'height', this.canvasHeight + '');

      this.drawOverlap(null);
  }

  resetPage(){
    //clear overlap / canvas
    this.clearCanvas(this.overlapElement);
    this.clearCanvas(this.canvasElement);

    //reset undo/redo stacks:
    this.undoStack = [new Image];
    this.redoStack = [];
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

  /*
  * Helper function, saves image currently on screen
  */
  saveCurrentImage() {
    //get the current canvas as an image
    var img = new Image;

    img.src = this.canvasElement.toDataURL();

    return img;
  }

  /*
  * Pushes the stroke to the undo stack
  */
  handleEndStroke() {
    var img = this.saveCurrentImage();

    this.undoStack.push(img);

    this.redoStack = []; //can't redo once you've added a new stroke!
  }

  /*
  * Handles when undo button is pushed
  */
  handleUndo(ev) {
    if (this.undoStack.length > 1) {
      this.clearCanvas(this.canvasElement);

      let ctx = this.canvasElement.getContext('2d');

      var img1 = this.undoStack.pop();

      //store image in redoStack in case of redo
      this.redoStack.push(img1);

      var img2 = this.undoStack.pop();
      this.undoStack.push(img2); //keeping current img at top of stack seems easiest

      //draw the old image
      ctx.drawImage(img2, 0, 0, img2.width, img2.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }
  }

  /*
  * Handles when redo button is pushed
  */
  handleRedo(ev) {
    if (this.redoStack.length > 0) {
      this.clearCanvas(this.canvasElement);

      let ctx = this.canvasElement.getContext('2d');

      var img = this.redoStack.pop();

      this.undoStack.push(img); //keeping current img at top of undo stack

      //draw the old image
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
    }
  }

  clearCanvas(canvas){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /*
  *Presents the popover menu with color and brush size
  */
  presentPopover(myEvent) {
    let popover = this.popoverCtrl.create(PopoverPage);
    popover.present({
      ev: myEvent
    });
  }

  /*
  * Causes an alert/confirmation screen to pop up when home button is pressed
  */
  presentConfirm() {
  let alert = this.alertCtrl.create({
    title: 'Confirm Action',
    message: 'Are you sure you want to leave your painting and go to the Home page?',
    buttons: [
      {
        text: 'Yes',
        handler: () => {
          this.navCtrl.setRoot(HomePage);
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          // console.log('Cancel clicked');
        }
      }
    ]
  });
  alert.present();
}

}
