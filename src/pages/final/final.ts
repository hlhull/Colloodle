import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage} from '../home/home';

import { ImageStorageProvider } from '../../providers/image-storage/image-storage';

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
  @ViewChild('topCanvas') Tcanvas: any;
  @ViewChild('middleCanvas') Mcanvas: any;
  @ViewChild('bottomCanvas') Bcanvas: any;

  landscape = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public imageStorage: ImageStorageProvider) {
    this.landscape = navParams.get('landscape');
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  /*
  * Takes the 3 picture urls passed in and draws them each on their own canvas,
  * scaling them down in the process. The canvases are stacked on one another,
  * so it becomes 1 picture.
  */
  drawPictures(pictures){
    if (this.landscape) { // USING ROTATION!!!
      let ctx = this.Tcanvas.nativeElement.getContext('2d');
      var img = pictures[0];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)

      ctx = this.Mcanvas.nativeElement.getContext('2d');
      img = pictures[1];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)

      ctx = this.Bcanvas.nativeElement.getContext('2d');
      img = pictures[2];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)
    } else { // NOT USING ROTATION, SQUISHING VERTICAL IMAGES
      var canvases = [this.Tcanvas, this.Mcanvas, this.Bcanvas];
      for (var i = 0; i < pictures.length; i++) {
        let ctx = canvases[i].nativeElement.getContext('2d'); // assigns context to appropriate canvas
        let img = new Image();
        img = pictures[i]; //assign image to one of the pictures passed into drawPictures
        img.onload = function() { //once the image loads, then draw it on the canvas
          ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
        }
      }
    }
  }

  /*
  * Draws the images rotated, images no longer squished
  */
  drawRotatedImage(image, ctx, x, y, angle) {
    // save the current context
    ctx.save();

    // move to the middle of where we want to draw our image
    ctx.translate(ctx.canvas.clientWidth/2, ctx.canvas.clientHeight/2);

    // rotate around that point USING RADIANS
    ctx.rotate(angle);

    // draw the image on the rotated context
    ctx.drawImage(image, 0, 0, image.width, image.height, -ctx.canvas.clientHeight/2, -ctx.canvas.clientWidth/2, ctx.canvas.clientHeight, ctx.canvas.clientWidth);

    // resotre old context
    ctx.restore();
  }

  /*
  * Downloads the 3 images from the appropriate group # and calls drawPictures
  * to draw them on the canvas
  */
  ngAfterViewInit(){
    var img = new Image();
    var pictures = [new Image(), new Image(), new Image()];

    // calls ImageStorage to download the image urls; once it gets them back,
    // then it assigns them to an array to pass to drawPictures
    Promise.all(this.imageStorage.getImageUrls('group#')).then((value) => {
      pictures[0].src = value[0];
      pictures[1].src = value[1];
      pictures[2].src = value[2];
      this.drawPictures(pictures);
    });

  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }
}
