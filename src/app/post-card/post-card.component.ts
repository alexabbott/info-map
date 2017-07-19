import { Component, Input, OnInit } from '@angular/core';
import { GlobalService } from '../services/global.service';
import { Router } from '@angular/router';
import { AngularFireDatabase, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { MdSnackBar, MdDialogRef, MdDialog } from '@angular/material';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

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

  constructor(public db: AngularFireDatabase, public afAuth: AngularFireAuth, public globalService: GlobalService, public snackBar: MdSnackBar, public dialog: MdDialog, public router: Router) {
    this.users = db.object('/users');
    this.filteredPosts = db.list('/posts');
    afAuth.authState.subscribe(auth => {
      if (auth) {
        this.user = db.object('/users/' + auth.uid);
        this.userId = auth.uid;
        this.userLikes = db.object('/user-likes/' + this.userId);
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
      this.db.object('/posts/' + this.post).subscribe(p => {
        this.post = p;
      });
    }
  }

  updatePost(key: string, location:string, tip:string, coordinates:string) {
    this.globalService.closeForm();
    this.globalService.setFormValues(key, location, tip, coordinates);
  }

  deletePost(key: string, location: string) {
    this.globalService.closeForm();
    let dialogRef = this.dialog.open(DeleteDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      this.selectedOption = result;
      if (this.selectedOption === 'delete') {
        this.db.list('/posts').remove(key);
        this.db.list('/user-posts/' + this.userId).remove(key);
        this.db.list('/location-posts/' + location + '/posts').remove(key);
        let loc = this.db.list('/location-posts/' + location + '/posts');
        loc.subscribe(posts => {
          let length = posts.length;
          if (length === 0) {
            this.db.list('/location-posts/').remove(location);
          }
        });

        let userLikesList = this.db.list('/user-likes');
        userLikesList.subscribe(users => {
          let usersLength = users.length;
          for (let i = 0; i < usersLength; i++) {
            if (users[i][key]) {
              this.db.list('/user-likes/' + users[i].$key + '/').remove(key);
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
    this.globalService.closeForm();
    this.db.object('/user-likes/' + this.userId + '/' + post.$key).set(Date.now());
    this.db.list('/posts/' + post.$key + '/likes/' + this.userId).push(this.userId);
    this.db.object('/users/' + post.user + '/postLikes/' + this.userId + post.$key).set(Date.now());
    let likes = this.db.list('/posts/' + post.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.db.object('/posts/' + post.$key).update({ likesTotal: -1*(length) });
    });

    this.snackBar.open('Liked post', 'OK!', {
      duration: 2000,
    });
  }

  unlikePost(post) {
    this.globalService.closeForm();
    this.db.list('/user-likes/' + this.userId).remove(post.$key);
    this.db.list('/posts/' + post.$key + '/likes').remove(this.userId);
    this.db.list('/users/' + post.user + '/postLikes').remove(this.userId + post.$key);
    let likes = this.db.list('/posts/' + post.$key + '/likes/');
    likes.subscribe(subscribe => {
      let length = subscribe.length;
      this.db.object('/posts/' + post.$key).update({ likesTotal: -1*(length) });
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
    this.globalService.closeForm();
    this.globalService.updateReset();
    this.globalService.filterBy.next('user');
    this.globalService.currentUserName.next(userName);
    this.router.navigate(['/'], { queryParams: {search: userName} });
    this.globalService.usersId.next(uid);
    userName = userName.split(' ')[0] + ' ' + userName.split(' ')[(userName.split(' ').length - 1)][0];
    this.globalService.searchTerm.next(userName);
  }

  filterByLocation(loc, coo) {
    this.globalService.closeForm();
    this.globalService.filterBy.next('location');
    this.globalService.locationPosts.next(loc);
    this.globalService.coordinates.next(coo);
    this.globalService.updateReset();
    this.router.navigate(['/'], { queryParams: {search: loc} });
  }
}
