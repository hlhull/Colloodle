import { Injectable } from '@angular/core';
import { ImageStorageProvider } from '../image-storage/image-storage';
import firebase from 'firebase';

/*
  LocalStorageProvider saves images locally for pass-Around mode
*/
@Injectable()
export class FriendsStorageProvider {
  groupNumber: string;
  sectionNumber: number;
  databaseRef = firebase.database().ref();
  storageRef = firebase.storage().ref();

  constructor(group){
    this.assignGroup(group);
  }

  assignGroup(group){
    var self = this;
    if(group == "new"){
      this.groupNumber = null;
      this.sectionNumber = 0;
      return new Promise(function(resolve, reject) { resolve(null) } );
    } else {
      this.groupNumber = group;
      return this.databaseRef.child("groups").child(group).once('value', function(snapshot) {
        self.sectionNumber = snapshot.val() % 10;
      });
    }
  }

}
