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


  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer, public imageStorage: ImageStorageProvider) {
    this.imageStorage = navParams.get('imageStorage');
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

  /*
  * Downloads the 3 images from the appropriate group # and calls drawPictures
  * to draw them on the canvas
  */
  ngAfterViewInit(){
    var img = new Image();
    var pictures = [new Image(), new Image(), new Image()];

    // calls ImageStorage to download the image urls; once it gets them back,
    // then it assigns them to an array to pass to drawPictures
    //var value = this.imageStorage.getImageUrls();
    this.imageStorage.getImageUrls().then((value) => {
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
