import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class GlobalService {
  public map = new BehaviorSubject(null);
  public coordinates = new BehaviorSubject(null);
  public filterKey = new BehaviorSubject(null);
  public filterValue = new BehaviorSubject(null);
  public headline = new BehaviorSubject(null);
  public showReset = new BehaviorSubject(false);
  public user = new BehaviorSubject(null);
  public users = new BehaviorSubject(null);
  public userId = new BehaviorSubject(null);
  public showForm = new BehaviorSubject(false);
  public searchTerm = new BehaviorSubject('');
  public postKey = new BehaviorSubject(null);
  public postTip = new BehaviorSubject(null);
  public postLocation = new BehaviorSubject(null);
  public postCoordinates = new BehaviorSubject(null);
  public postDate = new BehaviorSubject(null);
  public locationPosts = new BehaviorSubject(null);
  public filterBy = new BehaviorSubject(null);
  public currentLocation = new BehaviorSubject(null);
  public currentUserName = new BehaviorSubject(null);
  public showLocationPosts = new BehaviorSubject(false);
  public newLocation = new BehaviorSubject(null);
  public newCoordinates = new BehaviorSubject(null);
  // public postTag = new BehaviorSubject(null);
  // public showTagPosts = new BehaviorSubject(false);
  // public tagPosts = new BehaviorSubject(null);
  // public currentTag = new BehaviorSubject(null);
  public usersId = new BehaviorSubject(null);
  public usersName = new BehaviorSubject(null);
  public showUserProfile = new BehaviorSubject(false);

  public createMarker(location, coordinates) {
    this.newLocation.next(location);
    this.newCoordinates.next(coordinates);
  }
  public updateLocation(key, value) {
    this.filterKey.next(key);
    this.filterValue.next(value);
  }
  public updateMapCenter(coordinates) {
    this.coordinates.next(coordinates);
  }
  public updateReset() {
    this.showReset.next(true);
  }
  public updateHeadline(headline) {
    this.headline.next(headline);
  }
  public updateMap(themap) {
    this.map.next(themap);
  }
  public updateUsers(users) {
    this.users.next(users);
  }
  public updateUser(user) {
    this.user.next(user);
  }
  public updateUserId(id) {
    this.userId.next(id);
  }
  public showAddForm() {
    this.showForm.next(true);
  }
  public closeForm() {
    this.showForm.next(false);
  }
  public setFormValues(key, location, coordinates, tip, date) {
    this.postKey.next(key);
    this.postLocation.next(location);
    this.postTip.next(tip);
    this.postCoordinates.next(coordinates);
    this.postDate.next(date);
  }
}
