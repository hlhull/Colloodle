import { Injectable } from '@angular/core';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class LocalStorageProvider {
  storedImageUrls = [];
  numCanvases;

  constructor() {
    this.numCanvases = 0;
  }

  setUp(group, section){}

  /*
   * store image with given image url in the array
   */
  storeImage(imgUrl){
      //store image in storedImages
      this.storedImageUrls[this.numCanvases] = imgUrl;
      this.numCanvases = this.numCanvases + 1;

      //if we have 3 pictures
      if(this.numCanvases == 3){
        return true;
        //return new Promise(function(resolve, reject) { resolve(true) } );
      }
      return false;
      //return new Promise(function(resolve, reject) { resolve(false) } );
  }

  /*
   * gets the image urls
   */
  getImageUrls(){
    var urls = this.storedImageUrls;
    return new Promise(function(resolve, reject) { resolve(urls); });
  }

  getOverlap(){
    if (this.numCanvases > 0){
      var overlap =  this.storedImageUrls[this.numCanvases - 1];
      return new Promise(function(resolve, reject) { resolve(overlap); });
    }
    return null;
  }

  cancelDrawing(){
    return null;
  }

}
