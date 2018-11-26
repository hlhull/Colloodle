import { Component, ViewChild, Renderer, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, Content, Platform } from 'ionic-angular';
import { HomePage } from '../home/home';
import { PopoverController } from 'ionic-angular';
import { PopoverPage } from '../color-popover/color-popover'
import { FinalPage } from '../final/final';
import { ChooseFriendsPage } from '../choose-friends/choose-friends';
import { BrushProvider } from '../../providers/brush/brush';
import { AlertController } from 'ionic-angular';
import { RandomStorageProvider } from '../../providers/image-storage/random-storage';
import { PassAroundStorageProvider } from '../../providers/image-storage/pass-around-storage';
import { FriendsStorageProvider } from '../../providers/image-storage/friends-storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { StatusBar } from '@ionic-native/status-bar';

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
  drawingFromOverlap: boolean = false;

  combinedCanvasHeight: number; // overlap canvas + drawing canvas heights!
  overlapHeight: number;
  canvasHeight: number;
  canvasWidth: number;
  canvasLeft: number;

  undoStack = [];
  redoStack = []; //TypeScript [] appears to have push/pop stack functionality? Yay!

  imageStorage;

  constructor(public navCtrl: NavController, public popoverCtrl: PopoverController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public brushService: BrushProvider, private alertCtrl: AlertController, private screenOrientation: ScreenOrientation, private statusBar: StatusBar, private localNotifications: LocalNotifications) {
    this.imageStorage = navParams.get('imageStorage');

    this.statusBar.hide();
    this.screenOrientation.lock('landscape');

    platform.registerBackButtonAction(() => {},1);

    this.brushService.reset();
  }

  /*
   * sets the size of the main canvas and overlap canvas
   */
  ngAfterViewInit(){
      this.canvasElement = this.canvas.nativeElement;
      this.overlapElement = this.overlapCanvas.nativeElement;

      if (this.platform.height() > this.platform.width()) {
        // this is how it is on most phones, it takes the vertical height
        // when you take the platform height (and vice versa for width)
        // despite being in landscape mode

        // then our effective landscape width and height are the
        // platform height and width:
        this.setCanvasDimensions(this.platform.height(), this.platform.width());

      } else {
        // on ionic serve (and maybe some devices, who knows?) this is how it is,
        // the landscape height is seen as the platform height and vice versa

        // then our effective landscape width and height are the
        // platform height and width:
        this.setCanvasDimensions(this.platform.width(), this.platform.height());
      }

      // setting dimensions for the renderer:
      this.renderer.setElementAttribute(this.overlapElement, 'width', this.canvasWidth + '');
      this.renderer.setElementAttribute(this.overlapElement, 'height', this.overlapHeight + '');

      this.renderer.setElementAttribute(this.canvasElement, 'height', this.canvasHeight + '');
      this.renderer.setElementAttribute(this.canvasElement, 'width', this.canvasWidth + '');

      this.setCanvasToWhite();

      // push current image to undoStack
      var img = this.saveCurrentImage();
      this.undoStack.push(img);

      // once group and section #s are assigned, draw the overlap

      if (this.imageStorage instanceof PassAroundStorageProvider) {
        this.presentWhichSection(this.imageStorage.sectionNumber);
      } else if (this.imageStorage instanceof RandomStorageProvider){
        var self = this;
        this.imageStorage.assignGroup().then(() => {
          self.drawOverlap(null);
          this.presentWhichSection(this.imageStorage.sectionNumber);
        });
      } else {
        this.presentWhichSection(this.imageStorage.sectionNumber);
        this.drawOverlap(null);
      }

      this.removeOverlapIfHead();
  }

  /*
  * Helper function for ngAfterViewInit, this handles setting the canvasHeight
  * and canvasWidth, taking in the effective landscape width and height
  */
  setCanvasDimensions(landscapeWidth, landscapeHeight) {
    // new, overlap = 10% canvas height:

    this.combinedCanvasHeight = landscapeHeight;

    var usableWidth = landscapeWidth *.9 - 4;

    if(this.combinedCanvasHeight * (16/10)<= (usableWidth)){//hard coded ratio
      this.canvasWidth = this.combinedCanvasHeight * (16/10);
    } else {
      this.canvasWidth = usableWidth;
      this.combinedCanvasHeight = this.canvasWidth * (10/16);
    }

    // this.canvasLeft = (landscapeWidth - this.canvasWidth)/2;   // could not get this to actually be set in ngAfterViewInit
    this.overlapHeight = this.combinedCanvasHeight * (1/10);
    this.canvasHeight = this.combinedCanvasHeight * (9/10);
  }

  /*
    this helps with grabbing the color data for the pixels; if this is not
    set, then all pixels start as r=0 g=0 b=0 (even though they look white)
  */
  setCanvasToWhite() {
    var ctx = this.canvasElement.getContext("2d");
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);
  }

  /*
    fills overlap with background color if this is the head (removing overlap)
  */
  removeOverlapIfHead(){
    if(this.imageStorage.sectionNumber == 0){
      var ctx = this.overlapElement.getContext('2d');
      ctx.rect(0, 0, this.overlapElement.width, this.overlapElement.height);
      ctx.fillStyle = '#009691';
      ctx.fill();
    }
  }

  goHome(): void {
    this.presentConfirmGoHome();
  }

  /*
   * saves canvas, resets page, sets overlap, and goes to final page if 3 drawings done
   */
  nextStep(): void {
    //get the current canvas as an image, draw it on overlap when loaded
    var img = new Image();
    img.src = this.canvasElement.toDataURL(); //saving current image in cavas

    //store image
    if (this.imageStorage instanceof PassAroundStorageProvider){
      var proceed = this.imageStorage.storeImage(img.src);
      if (proceed) {
          this.navCtrl.push(FinalPage, {imageStorage: this.imageStorage}, {animate:false});
      } else {
        this.resetPage();
        this.drawOverlap(img);
        this.presentWhichSection(this.imageStorage.sectionNumber);
      }
    } else {
      this.imageStorage.updateGroup().then(() => this.imageStorage.storeImage(img.src).then((proceed) => {
          if (this.imageStorage.sectionNumber == 2) {
            this.navCtrl.push(FinalPage, {imageStorage: this.imageStorage}, {animate:false});
          }
          else if (this.imageStorage.sectionNumber == 1 || this.imageStorage instanceof RandomStorageProvider){
            this.presentInfo();
            this.navCtrl.push(HomePage);
          } else {
            this.navCtrl.setRoot(ChooseFriendsPage, {imageStorage: this.imageStorage, imgUrl: img.src});
          }
      }));
    }
  }

  drawOverlap(img){
    let ctx = this.overlapElement.getContext('2d');
    var overlap = this.overlapHeight;
    if (img == null) {
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

  resetPage(){
    //clear overlap / canvas
    this.clearCanvas(this.overlapElement);
    this.clearCanvas(this.canvasElement);

    // fill it with white
    this.setCanvasToWhite();

    //reset undo/redo stacks:
    // push current image to undoStack
    var img = this.saveCurrentImage();
    this.undoStack = [img];
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
    returns boolean of whether user drew to the specified edge of the canvas
  */
  checkEdgeOfCanvas(edge){
    var drewToEdge = false;
    let ctx = this.canvasElement.getContext('2d');

    if (edge == "top"){
      var imgDataEdge = ctx.getImageData(0, 2, this.canvasElement.width, 1);
    } else {
      var imgDataEdge = ctx.getImageData(0, this.canvasElement.height-3, this.canvasElement.width, 1);
    }
    var edge = imgDataEdge.data;

    var pix;
    for (pix = 0; (pix + 3) < edge.length; pix += 4) {
      if (edge[pix] != 255 || edge[pix+1] != 255 || edge[pix+2] != 255) {
        drewToEdge = true;
        break;
      }
    }

    return drewToEdge;
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

  overlapStart(ev){
    var canvasPosition = this.canvasElement.getBoundingClientRect();

    this.lastX = ev.touches[0].pageX - canvasPosition.x;
    this.lastY = ev.touches[0].pageY - canvasPosition.y;
  }

  overlapMove(ev){
    if(this.drawingFromOverlap){
        this.handleMove(ev);
    }
    else if(this.overlapHeight <= ev.touches[0].pageY){
        this.handleMove(ev);
        this.drawingFromOverlap = true;
    }
    else {
      var canvasPosition = this.canvasElement.getBoundingClientRect();

      this.lastX = ev.touches[0].pageX - canvasPosition.x;
      this.lastY = ev.touches[0].pageY - canvasPosition.y;
    }
  }

  overlapEnd(){
    if(this.drawingFromOverlap){
      this.handleEndStroke();
      this.drawingFromOverlap = false;
    }
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
      ctx.drawImage(img2, 0, 0);
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
      ctx.drawImage(img, 0, 0);
    }
  }

  clearCanvas(canvas){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /*
  * presents helpful info if user is lost
  */
  help() {
    this.presentWhichSection(this.imageStorage.sectionNumber);
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

  //TODO: !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!1
  // condense the code below, ideally we should have a single (main, not including
  // the helpers in count) function that takes in the section and then causes the
  // help popup to be displayed and include the body part and the edge/BOTH THE EDGES
  // (both edges=torso section) so the user gets all the info at once, rather than
  // being told to draw to the bottom, then later oh you didn't draw to the top, etc

  presentWhichSection(section){
    var bodyPart = ["head", "torso", "legs"];
    var edges = ["bottom edge", "top and bottom edges", "top edge"];
    let alert = this.alertCtrl.create({
      title: 'Instructions:',
      message: 'You are drawing the ' + bodyPart[section] + ". Make sure to draw all the way to the " + edges[section] + "!",
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  presentInfo(){
    let alertNotified = this.alertCtrl.create({
      title: 'Drawing',
      message: 'You will be notified when the drawing is complete!',
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });

    let alertNoNotifications = this.alertCtrl.create({
      title: 'Drawing',
      message: 'You can see the full drawing in the Gallery when the drawing is complete!',
      buttons: [
        {
          text: 'OK',
          handler: () => {}
        }
      ]
    });

    this.localNotifications.hasPermission().then((permission) => {
      if(!permission){
        this.localNotifications.requestPermission().then((permission) => {
          if(permission) {
            alertNotified.present()
          } else {
            alertNoNotifications.present();
          }
        });
      } else {
        alertNotified.present();
      }
    });
  }

  /*
  * Causes an alert/confirmation screen to pop up when home button is pressed
  */
  presentConfirmGoHome() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to leave and go to the Home page? Your drawing will be lost.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.imageStorage.cancelDrawing();
            this.navCtrl.setRoot(HomePage);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

  presentConfirmOrError(){
    var section = this.imageStorage.sectionNumber;

    if(!this.checkEdgeOfCanvas("bottom") && (section == 0 || section == 1)){
      this.presentError('bottom');
    }
    else if (!this.checkEdgeOfCanvas("top") && (section == 1 || section == 2)){
      this.presentError('top')
    }
    else {
      this.presentConfirmNextStep();
    }
  }

  presentError(whichEdge){
    var message = 'Be sure to draw to the very ' + whichEdge + ' edge of the screen'
    let alert = this.alertCtrl.create({
      title: 'Hold on!',
      message: message,
      buttons: [
        {
          text: 'Ok',
          handler: () => {
          }
        }]
    });
    alert.present();
  }

  /*
  * Causes an alert/confirmation screen to pop up when home button is pressed
  */
  presentConfirmNextStep() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you are finished with your section? Once you move on, you cannot come back to edit this drawing.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.nextStep();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {}
        }
      ]
    });
    alert.present();
  }

}
