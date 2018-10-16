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

  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform, public renderer: Renderer) {
    this.picture = navParams.get('data'); //array of images passed from DrawingPage
  }

  goHome(): void {
    this.navCtrl.setRoot(HomePage);
  }

  /*
  * Takes the 3 pictures from the DrawingPage and draws them each on their own canvas,
  * scaling them down in the process. The canvases are stacked on one another, so it becomes 1 picture.
  */
  drawPictures(){
    let ctx = this.Tcanvas.nativeElement.getContext('2d')
    var img = this.picture[0];
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    img = this.picture[1];
    ctx = this.Mcanvas.nativeElement.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);

    img = this.picture[2];
    ctx = this.Bcanvas.nativeElement.getContext('2d')
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, ctx.canvas.clientWidth, ctx.canvas.clientHeight);
  }

  ngAfterViewInit(){
      this.drawPictures();
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FinalPage');
  }
}
