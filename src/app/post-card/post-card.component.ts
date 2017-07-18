import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component'

@Component({
  selector: 'post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss']
})
export class PostCardComponent implements OnInit {
  @Input() post;
  filteredPosts: FirebaseListObservable<any[]>;
  user: FirebaseObjectObservable<any>;
  userLikes: FirebaseObjectObservable<any>;
  userPosts: FirebaseObjectObservable<any>;
  users: FirebaseObjectObservable<any>;
  userId: string;
  filterKey: string;
  filterValue: string;
  showReset: boolean;
  headline: string;
  openPost: string;
  dialogRef: MdDialogRef<any>;
  selectedOption: string;
  filterBy: string;

  constructor(public af: AngularFire, public globalService: GlobalService, public snackBar: MdSnackBar, public dialog: MdDialog) {
    this.users = af.database.object('/users');
    this.filteredPosts = af.database.list('/posts');
    this.af.auth.subscribe(auth => {
      if (auth) {
        this.user = af.database.object('/users/' + auth.uid);
        this.userId = auth.uid;
        this.userLikes = af.database.object('/user-likes/' + this.userId);
        this.user.subscribe(user => {
          // console.log('thieuser', user);
        });
      }
    });

    this.globalService.filterBy.subscribe(filter => {
      this.filterBy = filter;
    });
  }

  ngOnInit() {
    if (typeof this.post === 'string') {
      this.af.database.object('/posts/' + this.post).subscribe(p => {
        this.post = p;
      });
    }
  }

  updatePost(key: string, location:string, tip:string, coordinates:string) {
    this.globalService.closeForm();
    this.globalService.setFormValues(key, location, tip, coordinates);
  }

  deletePost(key: string, location: string) {
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      if (this.selectedOption === 'delete') {
        this.af.database.list('/posts').remove(key);
        this.af.database.list('/user-posts/' + this.userId).remove(key);
        this.af.database.list('/location-posts/' + location + '/posts').remove(key);
        let loc = this.af.database.list('/location-posts/' + location + '/posts');
        loc.subscribe(posts => {
          let length = posts.length;
          if (length === 0) {
            this.af.database.list('/location-posts/').remove(location);
          }
        });

        let userLikesList = this.af.database.list('/user-likes');
        userLikesList.subscribe(users => {
          let usersLength = users.length;
          for (let i = 0; i < usersLength; i++) {
            if (users[i][key]) {
              this.af.database.list('/user-likes/' + users[i].$key + '/').remove(key);
            }
          }
        });
        this.snackBar.open('Post deleted', 'OK!', {
          duration: 2000,
        });
      }
    });
  }

  likePost(post) {
    this.af.database.object('/user-likes/' + this.userId + '/' + post.$key).set(Date.now());
    this.af.database.list('/posts/' + post.$key + '/likes/' + this.userId).push(this.userId);
    this.af.database.object('/users/' + post.user + '/postLikes/' + this.userId + post.$key).set(Date.now());
    let likes = this.af.database.list('/posts/' + post.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/posts/' + post.$key).update({ likesTotal: -1*(length) });
    });

    this.snackBar.open('Liked post', 'OK!', {
      duration: 2000,
    });
  }

  unlikePost(post) {
    this.af.database.list('/user-likes/' + this.userId).remove(post.$key);
    this.af.database.list('/posts/' + post.$key + '/likes').remove(this.userId);
    this.af.database.list('/users/' + post.user + '/postLikes').remove(this.userId + post.$key);
    let likes = this.af.database.list('/posts/' + post.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.af.database.object('/posts/' + post.$key).update({ likesTotal: -1*(length) });
    });

    this.snackBar.open('Unliked post', 'OK!', {
      duration: 2000,
    });
  }

  // filterByTag(tag) {
  //   this.globalService.updateReset();
  //   this.globalService.filterBy.next('tag');
  //   this.globalService.tagPosts.next(tag);
  // }

  filterByUser(uid, userName) {
    this.globalService.updateReset();
    this.globalService.filterBy.next('user');
    this.globalService.currentUserName.next(userName);
    this.globalService.usersId.next(uid);
    userName = userName.split(' ')[0] + ' ' + userName.split(' ')[(userName.split(' ').length - 1)][0];
    this.globalService.searchTerm.next(userName);
  }

  filterByLocation(loc, coo) {
    this.globalService.filterBy.next('location');
    this.globalService.locationPosts.next(loc);
    this.globalService.coordinates.next(coo);
    this.globalService.updateReset();
    this.globalService.searchTerm.next(loc);
  }
}
