import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform, AlertController } from 'ionic-angular';
import { HomePage} from '../home/home';

import { ImageStorageProvider } from '../../providers/image-storage/image-storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { GroupManagerProvider } from '../../providers/group-manager/group-manager';
import { RandomStorageProvider } from '../../providers/image-storage/random-storage';
import { Screenshot } from '@ionic-native/screenshot';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Base64ToGallery } from '@ionic-native/base64-to-gallery';

/**
 * Class for the FinalPage page.
 *
 * Combines the drawn pictures into 1 final picture
 */

@IonicPage()
@Component({
  selector: 'page-final',
  templateUrl: 'final.html',
})
export class FinalPage {
  @ViewChild('finalCanvas') finalCanvas: any;
  @ViewChild('backgroundCanvas') backcanvas: any;

  canvasElement: any;
  picHeight: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public imageStorage: ImageStorageProvider, private screenOrientation: ScreenOrientation, public groupManager: GroupManagerProvider, private screenshot: Screenshot, private alertCtrl: AlertController, private socialSharing: SocialSharing, private base64ToGallery: Base64ToGallery) {
    this.imageStorage = navParams.get('imageStorage');

    this.screenOrientation.lock('portrait');
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  // save() {
    // // Take a screenshot and save to file
    // this.screenshot.save('jpg', 80, 'myscreenshot.jpg').then(
    //   res => console.log('Saved image to camera roll ', res),
    //   err => console.log('Error saving image to camera roll ', err)
    // );
    //
    // // Take a screenshot and get temporary file URI
    // this.screenshot.URI(80).then(
    //   res => console.log('Saved image to URI ', res),
    //   err => console.log('Error saving image to URI ', err)
    // );

    //somehow check if this is possible? (maybe unnecessary)

    // var img = new Image;
    //
    // img.src = this.canvasElement.toDataURL();

    // saveToPhotoAlbum only supported on iOS :(

    // this.socialSharing.saveToPhotoAlbum(img.src).then(() => {
    //   // Success!
    // }).catch(() => {
    //   // Error!
    // });


    // did not work, github link says "DISCONTINUED," which is sketchy

    // this.base64ToGallery.base64ToGallery(img.src).then(
    //   res => console.log('Saved image to gallery ', res),
    //   err => console.log('Error saving image to gallery ', err)
    // );
  // }

  // share() {
  //
  // }

  /*
    Takes the 3 picture urls passed in and loads them and then calls drawImages
  */
  loadImages(pictures){
    var loadedImages = 0;
    var numImages = 3;
    var images = {};
    var self = this;
    // get num of sources
    for(var i in pictures) {
      images[i] = new Image();
      images[i] = pictures[i]
      images[i].onload = function() {
        if(++loadedImages >= numImages) {
          //once all images are loaded, draw them
          self.drawImages(images);
        }
      };
    }
  }

  /*
    draws the loaded images in images{} onto the canvas
  */
  drawImages(images){
    let ctx = this.finalCanvas.nativeElement.getContext('2d'); // assigns context to appropriate canvas

    for (var i = 0; i < 3; i++) {
      ctx.drawImage(images[i], 0, i*this.picHeight, ctx.canvas.clientWidth, this.picHeight);
    }
  }

  /*
    Set canvas, then downloads the 3 images from the appropriate group # and calls
    loadImages to draw them on the canvas
  */
  ngAfterViewInit(){
    this.setCanvas();

    var img = new Image();
    var pictures = [new Image(), new Image(), new Image()];
    // pictures[0].setAttribute("crossOrigin","anonymous");
    // pictures[1].setAttribute("crossOrigin","anonymous");
    // pictures[2].setAttribute("crossOrigin","anonymous");

    // calls ImageStorage to download the image urls; once it gets them back,
    // then it assigns them to an array to pass to drawPictures
    //var value = this.imageStorage.getImageUrls();
    this.imageStorage.getImageUrls().then((value) => {
       pictures[0].src = value[0];
       pictures[1].src = value[1];
       pictures[2].src = value[2];
       this.loadImages(pictures);
     });
     //
     // var img = new Image;
     //
     // img.src = this.canvasElement.toDataURL();

  }

  /*
    sets the canvas size to be as large as possible while keeping 16:9 ratio
    for each image
  */
  setCanvas(){
    // get the max height / width we can use
    var canvas = document.getElementById('backgroundCanvas');
    this.canvasElement = this.backcanvas.nativeElement;

    var maxHeight = this.canvasElement.offsetHeight;
    var maxWidth = this.canvasElement.offsetWidth;

    // set height / width of canvas with 16:9 ratio
    var c = <HTMLCanvasElement>document.getElementById('finalCanvas');
    if(maxHeight < maxWidth){
      // when coming from drawing page, sometimes it'll still think it's in
      // landscape, so we need to switch height and width
      var temp = maxWidth;
      maxWidth = maxHeight;
      maxHeight = temp;
    }
    if((maxHeight/3) > (maxWidth*(9/16))){
      this.picHeight = ((27/16)*maxWidth)/3;
      c.width = maxWidth;
      c.height = this.picHeight*3;
    } else {
      this.picHeight = maxHeight / 3;
      c.width = ((16/9)*this.picHeight);
      c.height = this.picHeight*3;
    }
  }


  deleteGroup(){
    this.groupManager.deleteGroup(this.imageStorage.groupNumber);
    
    //if it came from the Gallery (have back button to Gallery), go back to gallery
    //otherwise, if no back button, came from drawing page, so go home
    if(this.navCtrl.length() > 1){
      this.navCtrl.pop();
    } else {
      this.goHome();
    }
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }

  /*
  * Causes an alert/confirmation screen to pop up when delete/trash button is pressed
  */
  presentConfirmDelete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Action',
      message: 'Are you sure you want to delete this drawing? If you delete it, it cannot be recovered.',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteGroup();
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
