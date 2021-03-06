import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { GlobalService } from '../services/global.service';
import { BehaviorSubject } from "rxjs/Rx";
import { MdSnackBar } from '@angular/material';

@Component({
  selector: 'add-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.scss']
})
export class FormComponent {
  filteredPosts: FirebaseListObservable<any[]>;
  user: any;
  showForm: boolean;
  postKey: any;
  newTip: string;
  newLocation: string;
  newCoordinates: string;
  newDate: string;
  newTag: string;
  tags: Array<any>;
  map: any;
  maxDate: any;

  private clientId: string = '8e1349e63dfd43dc67a63e0de3befc68';

  constructor(public db: AngularFireDatabase, public globalService: GlobalService, public snackBar: MdSnackBar) {

    this.maxDate = new Date();

    this.filteredPosts = db.list('/posts');

    // this.tags = [
    //   { value: 'Chilling' },
    //   { value: 'Working out' },
    // ];

    globalService.user.subscribe(user => {
      this.user = user;
    });

    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });

    globalService.map.subscribe(themap => {
      this.map = themap;
    });

    globalService.postTip.subscribe(tip => {
      this.newTip = tip;
    });

    globalService.postLocation.subscribe(location => {
      this.newLocation = location;
    });

    // globalService.postTag.subscribe(tag => {
    //   this.newTag = tag;
    // });

    globalService.postCoordinates.subscribe(coordinates => {
      this.newCoordinates = coordinates;
    });

    globalService.postKey.subscribe(key => {
      this.postKey = key;
    });

    globalService.postDate.subscribe(key => {
      this.newDate = key;
    });
  }

  hashCode(word: string) {
    var hash = 0, i, chr;
    if (word.length === 0) return hash;
    for (i = 0; i < word.length; i++) {
      chr   = word.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  addPost(newLocation: string, newCoordinates: string, newTip: string, newDate: any) {
    let d = new Date();
    let postDate = d.getTime();

    // if (!newTag) {
    //   newTag = '';
    // }
    if (newLocation && newCoordinates && newTip && postDate) {
      let newKey = this.hashCode(newLocation) + postDate.toString();
      newLocation = newLocation.replace(/\./g, '').trim();

      let postData = {
        location: newLocation,
        coordinates: newCoordinates,
        tip: newTip,
        user: this.user.uid,
        userName: this.user.displayName,
        published: postDate,
        rpublished: -1*(postDate),
        likesTotal: 0
      }

      if (newDate) {
        postData['visitDate'] = newDate.getTime();
      }

      this.db.object('/posts/' + newKey).update(postData);
      this.db.object('/location-posts/' + newLocation).update({ coordinates: newCoordinates });
      this.db.object('/location-posts/' + newLocation + '/posts/' + newKey).set(Date.now());
      this.db.object('/user-posts/' + this.user.uid + '/' + newKey).set(Date.now());

      this.newLocation = '';
      this.newCoordinates = '';
      this.newTip = '';
      this.newDate = null;
      // this.newTag = '';

      this.showForm = false;

      this.snackBar.open('Post saved', 'OK!', {
        duration: 2000,
      });
    }
  }

  updatePost(key, newLocation, newCoordinates, newTip, newDate) {
    let d = new Date();
    let postDate = d.getTime();

    if (newLocation && newCoordinates && newTip && postDate) {
      newLocation = newLocation.replace(/\./g, '').trim();

      let postData = {
        location: newLocation,
        coordinates: newCoordinates,
        tip: newTip,
        user: this.user.uid,
        userName: this.user.displayName,
        published: postDate,
        rpublished: -1*(postDate),
        likesTotal: 0
      }

      if (newDate) {
        postData['visitDate'] = newDate.getTime();
      }

      this.db.object('/posts/' + key).update({ location: newLocation, coordinates: newCoordinates, tip: newTip, published: postDate, rpublished: -1*(postDate) });
      this.db.object('/location-posts/' + newLocation + '/posts/' + key).set(Date.now());
      this.db.object('/location-posts/' + newLocation).update({ coordinates: newCoordinates });
      this.db.object('/user-posts/' + this.user.uid + '/' + key).set(Date.now());

      this.newLocation = '';
      this.newCoordinates = '';
      this.newTip = '';
      this.newDate = null;
      // this.newTag = '';

      this.showForm = false;

      this.snackBar.open('Post updated', 'OK!', {
        duration: 2000,
      });
    }
  }
}
