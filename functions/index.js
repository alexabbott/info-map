/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Keeps track of the length of the 'likes' child list in a separate property.
exports.countplaylistchange = functions.database.ref('/user-posts/{userid}/{postid}').onWrite(event => {

  const db = admin.database();
  const collectionRef = db.ref(`/users/${event.params.userid}`);
  const countRef = collectionRef.child('posts_count');

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return countRef.transaction(current => {
    if (event.data.exists() && !event.data.previous.exists()) {
      return (current || 0) - 1;
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
      return (current || 0) + 1;
    }
  }).then(() => {
    console.log('Counter updated.');
  });
});

// If the number of likes gets deleted, recount the number of likes
exports.recountlikes = functions.database.ref('/users/{userid}/posts_count').onWrite(event => {
  if (!event.data.exists()) {
    const counterRef = event.data.ref;

    const db = admin.database();
    const collectionRef = db.ref(`/user-posts/${event.params.userid}`);

    // Return the promise from counterRef.set() so our function 
    // waits for this async event to complete before it exits.
    return collectionRef.once('value')
        .then(messagesData => counterRef.set(-1*(messagesData.numChildren())));
  }
});

// Keeps track of the length of the 'posts' child list in a separate property.
exports.countlocationchange = functions.database.ref('/location-posts/{locationid}/posts/{postid}').onWrite(event => {
  const collectionRef = event.data.ref.parent;
  const countRef = collectionRef.parent.child('posts_count');

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return countRef.transaction(current => {
    if (event.data.exists() && !event.data.previous.exists()) {
      return (current || 0) - 1;
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
      return (current || 0) + 1;
    }
  }).then(() => {
    console.log('Counter updated.');
  });
});

// If the number of likes gets deleted, recount the number of likes
exports.recountposts = functions.database.ref('/location-posts/{locationid}/posts_count').onWrite(event => {
  if (!event.data.exists()) {
    const counterRef = event.data.ref;
    const collectionRef = counterRef.parent.child('posts');

    // Return the promise from counterRef.set() so our function 
    // waits for this async event to complete before it exits.
    return collectionRef.once('value')
        .then(messagesData => counterRef.set(-1*(messagesData.numChildren())));
  }
});

// Keeps track of the length of the 'posts' child list in a separate property.
exports.countlikeschange = functions.database.ref('/users/{userid}/postLikes/{likeid}').onWrite(event => {
  const collectionRef = event.data.ref.parent;
  const countRef = collectionRef.parent.child('likesCount');

  // Return the promise from countRef.transaction() so our function
  // waits for this async event to complete before it exits.
  return countRef.transaction(current => {
    if (event.data.exists() && !event.data.previous.exists()) {
      return (current || 0) - 1;
    }
    else if (!event.data.exists() && event.data.previous.exists()) {
      return (current || 0) + 1;
    }
  }).then(() => {
    console.log('Counter updated.');
  });
});

// If the number of likes gets deleted, recount the number of likes
exports.recountuserlikes = functions.database.ref('/users/{userid}/likesCount').onWrite(event => {
  if (!event.data.exists()) {
    const counterRef = event.data.ref;
    const collectionRef = counterRef.parent.child('postLikes');

    // Return the promise from counterRef.set() so our function 
    // waits for this async event to complete before it exits.
    return collectionRef.once('value')
        .then(messagesData => counterRef.set(-1*(messagesData.numChildren())));
  }
});