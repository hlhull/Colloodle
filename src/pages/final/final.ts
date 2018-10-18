import { Component, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { HomePage} from '../home/home';
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

  picture: any;

  landscape = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer) {
    this.picture = navParams.get('data'); //array of images passed from DrawingPage
    this.landscape = navParams.get('landscape');
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  /*
  * Takes the 3 pictures from the DrawingPage and draws them each on their own canvas,
  * scaling them down in the process. The canvases are stacked on one another, so it becomes 1 picture.
  */
  drawPictures(){
    if (this.landscape) { // USING ROTATION!!!
      let ctx = this.Tcanvas.nativeElement.getContext('2d');
      var img = this.picture[0];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)

      ctx = this.Mcanvas.nativeElement.getContext('2d');
      img = this.picture[1];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)

      ctx = this.Bcanvas.nativeElement.getContext('2d');
      img = this.picture[2];
      this.drawRotatedImage(img, ctx, ctx.canvas.clientWidth, ctx.canvas.clientHeight, Math.PI/2)
    } else { // NOT USING ROTATION, SQUISHING VERTICAL IMAGES
      let ctx = this.Tcanvas.nativeElement.getContext('2d');
      var img = this.picture[0];
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

      ctx = this.Mcanvas.nativeElement.getContext('2d');
      img = this.picture[1];
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

      ctx = this.Bcanvas.nativeElement.getContext('2d');
      img = this.picture[2];
      img.onload = function(){ //last picture may not have loaded yet --> make sure it has loaded before we draw it
      ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
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


  ngAfterViewInit(){
      this.drawPictures();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }
}
