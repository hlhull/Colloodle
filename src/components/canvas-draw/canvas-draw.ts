import { Component, ViewChild, Renderer } from '@angular/core';
import { Platform, normalizeURL, Content } from 'ionic-angular';
import { File, IWriteOptions } from '@ionic-native/file';
import { Storage } from '@ionic/storage';

const STORAGE_KEY = 'IMAGE_LIST';

/**
 * Generated class for the CanvasDrawComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'canvas-draw',
  templateUrl: 'canvas-draw.html'
})
export class CanvasDrawComponent {

   @ViewChild('myCanvas') canvas: any;
   @ViewChild(Content) content: any;
   @ViewChild('fixedContainer') fixedContainer: any;

   canvasElement: any;
   lastX: number;
   lastY: number;

   currentColour: string = '#1abc9c';
   availableColours: any;

   brushSize: number = 10;

   storedImages = [];

   constructor(public platform: Platform, private file: File, private storage: Storage, public renderer: Renderer) {
     console.log('Hello CanvasDraw Component');

     this.availableColours = [
         '#1abc9c',
         '#3498db',
         '#9b59b6',
         '#e67e22',
         '#e74c3c'
     ];

     // Load all stored images when the app is ready
     this.storage.ready().then(() => {
       this.storage.get(STORAGE_KEY).then(data => {
         if (data != undefined) {
           this.storedImages = data;
         }
       });
     });
    }

    changeColour(colour){
        this.currentColour = colour;
    }

    changeSize(size){
        this.brushSize = size;
    }

    ngAfterViewInit(){
        this.canvasElement = this.canvas.nativeElement;

        this.renderer.setElementAttribute(this.canvasElement, 'width', this.platform.width() + '');
        this.renderer.setElementAttribute(this.canvasElement, 'height', this.platform.height() + '');
    }

    handleStart(ev){
        var canvasPosition = this.canvasElement.getBoundingClientRect();

        this.lastX = ev.touches[0].pageX - canvasPosition.x;
        this.lastY = ev.touches[0].pageY - canvasPosition.y;

        let ctx = this.canvasElement.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.lastX, this.lastY, this.brushSize/2, 0, 2 * Math.PI);
        ctx.fillStyle = this.currentColour;
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
        ctx.strokeStyle = this.currentColour;
        ctx.lineWidth = this.brushSize;
        ctx.stroke();

        this.lastX = currentX;
        this.lastY = currentY;
    }

    clearCanvas(){
      let ctx = this.canvasElement.getContext('2d');
      ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);
    }

    saveCanvasImage() {
      var dataUrl = this.canvasElement.toDataURL();
      this.clearCanvas();

      let name = new Date().getTime() + '.png';
      let path = this.file.dataDirectory;
      let options: IWriteOptions = { replace: true };

      var data = dataUrl.split(',')[1];
      let blob = this.b64toBlob(data, 'image/png');

      this.file.writeFile(path, name, blob, options).then(res => {
        this.storeImage(name);
      }, err => {
        console.log('error: ', err);
      });
    }

  // https://forum.ionicframework.com/t/save-base64-encoded-image-to-specific-filepath/96180/3
  b64toBlob(b64Data, contentType) {
    contentType = contentType || '';
    var sliceSize = 512;
    var byteCharacters = atob(b64Data);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  ionViewDidEnter() {
  // https://github.com/ionic-team/ionic/issues/9071#issuecomment-362920591
  // Get the height of the fixed item
  let itemHeight = this.fixedContainer.nativeElement.offsetHeight;
  let scroll = this.content.getScrollElement();

  // Add preexisting scroll margin to fixed container size
  itemHeight = Number.parseFloat(scroll.style.marginTop.replace("px", "")) + itemHeight;
  scroll.style.marginTop = itemHeight + 'px';
  }

  ionViewDidLoad() {
  // Set the Canvas Element and its size
  this.canvasElement = this.canvas.nativeElement;
  this.canvasElement.width = this.platform.width() + '';
  this.canvasElement.height = 200;
  }

  storeImage(imageName) {
    let saveObj = { img: imageName };
    this.storedImages.push(saveObj);
    this.storage.set(STORAGE_KEY, this.storedImages).then(() => {
      setTimeout(() =>  {
        this.content.scrollToBottom();
      }, 500);
    });
  }

  removeImageAtIndex(index) {
    let removed = this.storedImages.splice(index, 1);
    this.file.removeFile(this.file.dataDirectory, removed[0].img).then(res => {
    }, err => {
      console.log('remove err; ' ,err);
    });
    this.storage.set(STORAGE_KEY, this.storedImages);
  }

  getImagePath(imageName) {
    let path = this.file.dataDirectory + imageName;
    // https://ionicframework.com/docs/wkwebview/#my-local-resources-do-not-load
    path = normalizeURL(path);
    return path;
  }


}
