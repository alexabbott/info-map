import { Component, Output, EventEmitter } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
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
  newTag: string;
  tags: Array<any>;
  map: any;

  private clientId: string = '8e1349e63dfd43dc67a63e0de3befc68';

  constructor(public af: AngularFire, public globalService: GlobalService, public snackBar: MdSnackBar) {

    this.filteredPosts = af.database.list('/posts');

    // this.tags = [
    //   { value: 'Blazing' },
    //   { value: 'Chilling' },
    //   { value: 'Commuting' },
    //   { value: 'Dancing' },
    //   { value: 'Driving' },
    //   { value: 'Festival' },
    //   { value: 'Focusing' },
    //   { value: 'Getting ready' },
    //   { value: 'Getting weird' },
    //   { value: 'Hiking' },
    //   { value: 'Hooking up' },
    //   { value: 'Partying' },
    //   { value: 'Pregaming' },
    //   { value: 'Road tripping' },
    //   { value: 'Rocking out' },
    //   { value: 'Running' },
    //   { value: 'Tripping balls' },
    //   { value: 'Waking up' },
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

  addPost(newLocation: string, newCoordinates: string, newTip: string) {
    let d = new Date();
    let newDate = d.getTime();
    // if (!newTag) {
    //   newTag = '';
    // }
    if (newLocation && newCoordinates && newTip && newDate) {
      let newKey = this.hashCode(newLocation) + newDate.toString();
      this.af.database.object('/posts/' + newKey).update({ location: newLocation, tip: newTip, user: this.user.uid, userName: this.user.displayName, published: newDate, likesTotal: 0 });
      this.af.database.object('/location-posts/' + newLocation + '/posts/' + newKey).set(Date.now());
      this.af.database.object('/location-posts/' + newLocation).update({ coordinates: newCoordinates });
      this.af.database.object('/user-posts/' + this.user.uid + '/' + newKey).set(Date.now());

      this.newLocation = '';
      this.newCoordinates = '';
      this.newTip = '';
      // this.newTag = '';

      this.globalService.toggleForm();

      this.snackBar.open('Post saved', 'OK!', {
        duration: 2000,
      });
    }
  }

  updatePost(key, newLocation, newCoordinates, newTip) {
    let d = new Date();
    let newDate = d.getTime();
    if (newLocation && newCoordinates && newTip && newDate) {
      this.af.database.object('/posts/' + key).update({ location: newLocation, tip: newTip, published: newDate });
      this.af.database.object('/location-posts/' + newLocation + '/posts/' + key).set(Date.now());
      this.af.database.object('/location-posts/' + newLocation).update({ coordinates: newCoordinates });
      this.af.database.object('/user-posts/' + this.user.uid + '/' + key).set(Date.now());

      this.newLocation = '';
      this.newCoordinates = '';
      this.newTip = '';
      // this.newTag = '';

      this.globalService.toggleForm();

      this.snackBar.open('Post updated', 'OK!', {
        duration: 2000,
      });
    }
  }
}
