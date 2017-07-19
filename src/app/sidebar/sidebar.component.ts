import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { GlobalService } from '../services/global.service';
import { ActivatedRoute, Router, Params } from '@angular/router';

@Component({
  selector: 'side-bar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})

export class SidebarComponent {
  map: any;
  filteredPosts: FirebaseListObservable<any[]>;
  filteredUsers: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  userPosts: FirebaseListObservable<any[]>;
  usersPosts: FirebaseListObservable<any[]>;
  userLikedPosts: FirebaseListObservable<any[]>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  displayName: string;
  showReset: boolean;
  showForm: boolean;
  showMenu: boolean;
  searchTerm: string;
  filterBy: string;
  orderBy: string;
  showCurrentUserProfile: boolean;
  currentUserName: string;
  currentUserId: string;
  totalCurrentUserLikes: number;
  currentUserPostCount: number;
  currentUserLikedCount: number;
  selectedUserLikedCount: number;
  selectedUserPostCount: number;
  showLocationPosts: boolean;
  // showTagPosts: boolean;
  showUserProfile: boolean;
  searchLabel: string;
  af: any;

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth, public globalService: GlobalService, public route: ActivatedRoute, public router: Router) {

    this.orderBy = 'newestPosts';
    this.filteredPosts = db.list('/posts', {
      query: {
        orderByChild: 'rpublished',
      }
    });
    this.users = db.object('/users');
    this.showForm = false;
    this.showMenu = false;
    this.showCurrentUserProfile = false;
    this.totalCurrentUserLikes = 0;
    this.currentUserPostCount = 0;
    this.currentUserLikedCount = 0;
    this.searchLabel = 'destinations';

    let me = this;

    this.af = afAuth.authState;

    afAuth.authState.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        this.displayName = auth.displayName;
        globalService.updateUser(auth);
        globalService.updateUserId(this.userId);
        db.object('/users/' + this.userId).update({ name: auth.displayName, uid: auth.uid, photoURL: auth.photoURL, email: auth.email });
        this.user = db.object('/users/' + this.userId);
        this.userPosts = db.list('/posts', {
          query: {
            orderByChild: 'user',
            equalTo: this.userId
          }
        });
        this.userPosts.subscribe(post => {
          this.currentUserPostCount = post.length;
          for (let i = 0; i < this.currentUserPostCount; i++) {
            this.totalCurrentUserLikes += post[i].likesTotal;
          }
        });
        this.userLikedPosts = db.list('/user-likes/' + this.userId);
        this.userLikedPosts.subscribe(post => {
          this.currentUserLikedCount = post.length;
        });
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });

    globalService.map.subscribe(themap => {
      this.map = themap;
    });
    globalService.showReset.subscribe(bool => {
      this.showReset = bool;
    });
    globalService.showForm.subscribe(bool => {
      this.showForm = bool;
    });

    globalService.filterBy.subscribe(filter => {
      this.filterBy = filter;
    });

    globalService.searchTerm.subscribe(term => {
      this.searchTerm = term;
    });

    // filter by user
    globalService.currentUserName.subscribe(name => {
      this.currentUserName = name;
    });
    globalService.usersId.subscribe(uid => {
      this.currentUserId = uid;
      if (uid) {
        this.showCurrentUserProfile = false;
        this.filteredPosts = db.list('/posts', {
          query: {
            orderByChild: 'user',
            equalTo: uid
          }
        });
        this.searchLabel = 'destinations';
      }
    });

    // filter by location
    globalService.locationPosts.subscribe(location => {
      globalService.currentLocation = location;
      if (location) {
        this.showCurrentUserProfile = false;
        this.searchLabel = 'destinations';
        this.filteredPosts = db.list('/posts', {
          query: {
            orderByChild: 'location',
            equalTo: location
          }
        });
      }
    });

    // filter by tag
    // globalService.tagPosts.subscribe(tag => {
    //   globalService.currentPost = tag;
    //   if (tag) {
    //     this.showCurrentUserProfile = false;
    //     this.changeOrder('-likesTotal');
    //     this.filteredPosts = db.list('/posts', {
    //       query: {
    //         orderByChild: 'tag',
    //         equalTo: tag
    //       }
    //     });
    //   }
    // });
  }

  ngOnInit() {
    this.router.events.subscribe((val) => {
         this.searchTerm = this.route.snapshot.queryParams['search'];
    });

    this.route.params.subscribe((params: Params) => {
      this.searchTerm = this.route.snapshot.queryParams['search'];
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());;
  }

  logout() {
     this.afAuth.auth.signOut();
  }

  resetPosts() {
    this.filteredPosts = this.db.list('/posts', {
      query: {
        orderByChild: 'rpublished',
      }
    });
    this.showReset = false;
    this.showCurrentUserProfile = false;
    this.globalService.filterBy.next('');
    this.map.setZoom(3);
    this.searchTerm = '';
    this.router.navigate(['/'], { queryParams: {search: null} });
    this.searchLabel = 'destinations';
    this.orderBy = 'newestPosts';
  }

  filterByCurrentUser() {
    this.showReset = true;
    this.showMenu = false;
    this.showCurrentUserProfile = true;
    this.globalService.filterBy.next('currentUser');
    let name = this.displayName.split(' ')[0] + ' ' + this.displayName.split(' ')[(this.displayName.split(' ').length - 1)][0];
    this.searchTerm = name;
    this.orderBy = 'newestPosts';
  }

  showNewestPosts() {
    this.searchLabel = 'destinations';
    this.showReset = true;
    this.filteredPosts = this.db.list('/posts', {
      query: {
        orderByChild: 'rpublished',
      }
    });
    this.orderBy = 'newestPosts';
    this.showCurrentUserProfile = false;
  }

  showPopularPosts() {
    this.searchLabel = 'destinations';
    this.showReset = true;
    this.filteredPosts = this.db.list('/posts', {
      query: {
        orderByChild: 'likesTotal',
      }
    });
    this.orderBy = 'popularPosts';
    this.showCurrentUserProfile = false;
  }

  showTopUsers() {
    this.searchLabel = 'users';
    this.showReset = true;
    this.globalService.filterBy.next('topUsers');
    this.filteredPosts = this.db.list('/users', {
      query: {
        orderByChild: 'posts_count',
      }
    });
    this.orderBy = 'topUsers';
    this.showCurrentUserProfile = false;
  }

  showTopDestinations() {
    this.searchLabel = 'destinations';
    this.showReset = true;
    this.globalService.filterBy.next('topDestinations');
    this.filteredPosts = this.db.list('/location-posts', {
      query: {
        orderByChild: 'posts_count',
      }
    });
    this.orderBy = 'topDestinations';
    this.showCurrentUserProfile = false;
  }

  showRandomLocation() {
    this.filteredPosts.subscribe(post => {
      let randomLocation = post[Math.floor(Math.random()*post.length)];
      this.searchTerm = randomLocation.location;
      this.globalService.coordinates.next(randomLocation.coordinates);
    });
  }
}
