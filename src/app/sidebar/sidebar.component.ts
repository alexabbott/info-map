import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { GlobalService } from '../services/global.service';

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
  orderValue: string;
  showReset: boolean;
  showForm: boolean;
  showMenu: boolean;
  searchTerm: string;
  filterBy: string;
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

  constructor(public af: AngularFire, public globalService: GlobalService) {
    this.orderValue = '-published';
    this.filteredPosts = af.database.list('/posts');
    this.users = af.database.object('/users');
    this.showForm = false;
    this.showMenu = false;
    this.showCurrentUserProfile = false;
    this.totalCurrentUserLikes = 0;
    this.currentUserPostCount = 0;
    this.currentUserLikedCount = 0;
    this.searchLabel = 'destinations';

    let me = this;

    this.af.auth.subscribe(auth => {
      if (auth) {
        this.userId = auth.uid;
        globalService.updateUser(auth.auth);
        globalService.updateUserId(this.userId);
        af.database.object('/users/' + this.userId).update({ name: auth.auth.displayName, uid: auth.uid, photoURL: auth.auth.photoURL, email: auth.auth.email });
        this.user = af.database.object('/users/' + this.userId);
        this.userPosts = af.database.list('/posts', {
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
        this.userLikedPosts = af.database.list('/user-likes/' + this.userId);
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

    // filter by user
    globalService.currentUserName.subscribe(name => {
      this.currentUserName = name;
    });
    globalService.usersId.subscribe(uid => {
      this.currentUserId = uid;
      if (uid) {
        this.showCurrentUserProfile = false;
        this.filteredPosts = af.database.list('/posts', {
          query: {
            orderByChild: 'user',
            equalTo: uid
          }
        });
        this.selectedUserLikedCount = 0;
        this.changeOrder('-published');
        this.searchLabel = 'destinations';
        this.filteredPosts.subscribe(post => {
          this.selectedUserPostCount = post.length;
          for (let i = 0; i < this.selectedUserPostCount; i++) {
            this.selectedUserLikedCount += post[i].likesTotal;
          }
        });
      }
    });

    // filter by location
    globalService.locationPosts.subscribe(location => {
      globalService.currentLocation = location;
      if (location) {
        this.showCurrentUserProfile = false;
        this.changeOrder('-likesTotal');
        this.searchLabel = 'destinations';
        this.filteredPosts = af.database.list('/posts', {
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
    //     this.filteredPosts = af.database.list('/posts', {
    //       query: {
    //         orderByChild: 'tag',
    //         equalTo: tag
    //       }
    //     });
    //   }
    // });
  }

  login() {
    this.af.auth.login();
  }

  logout() {
     this.af.auth.logout();
  }

  togglePostForm() {
    this.globalService.toggleForm();
    this.globalService.postKey.next(null)
  }

  resetPosts() {
    this.filteredPosts = this.af.database.list('/posts');
    this.showReset = false;
    this.showCurrentUserProfile = false;
    this.globalService.filterBy.next('');
    this.map.setZoom(3);
    this.searchTerm = '';
    this.changeOrder('-published');
    this.searchLabel = 'destinations';
  }

  changeOrder(neworder) {
    this.orderValue = neworder;
  }

  filterByCurrentUser() {
    this.showReset = true;
    this.showMenu = false;
    this.showCurrentUserProfile = true;
    this.globalService.filterBy.next('currentUser');
  }

  showNewestPosts() {
    this.searchLabel = 'destinations';
    this.filteredPosts = this.af.database.list('/posts');
    this.changeOrder('-published');
  }

  showPopularPosts() {
    this.searchLabel = 'destinations';
    this.filteredPosts = this.af.database.list('/posts');
    this.changeOrder('-likesTotal');
  }

  showTopUsers() {
    this.searchLabel = 'users';
    this.showReset = true;
    this.globalService.filterBy.next('topUsers');
    this.filteredPosts = this.af.database.list('/users');
    this.changeOrder('-posts_count');
  }

  showTopDestinations() {
    this.searchLabel = 'destinations';
    this.showReset = true;
    this.globalService.filterBy.next('topDestinations');
    this.filteredPosts = this.af.database.list('/location-posts');
    this.changeOrder('-posts_count');
  }
}
