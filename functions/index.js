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

// Authenticate to Algolia Database.
// TODO: Make sure you configure the `algolia.app_id` and `algolia.api_key` Google Cloud environment variables.
const algoliasearch = require('algoliasearch');
const client = algoliasearch(functions.config().algolia.app_id, functions.config().algolia.api_key);

// var database = admin.database();
// var postsRef = database.ref('/posts');
// var index = client.initIndex('posts');
// postsRef.once('value', initialImport);
// function initialImport(dataSnapshot) {
//   // Array of data to index
//   var objectsToIndex = [];
//   // Get all objects
//   var values = dataSnapshot.val();
//   // Process each child Firebase object
//   dataSnapshot.forEach((function(childSnapshot) {
//     // get the key and data from the snapshot
//     var childKey = childSnapshot.key;
//     var childData = childSnapshot.val();
//     // Specify Algolia's objectID using the Firebase object key
//     childData.objectID = childKey;
//     // Add object for indexing
//     objectsToIndex.push(childData);
//   }))
//   // Add or update new objects
//   index.saveObjects(objectsToIndex, function(err, content) {
//     if (err) {
//       throw err;
//     }
//     console.log('Firebase -> Algolia import done');
//     process.exit(0);
//   });
// }

// Name fo the algolia index for Blog posts content.
const ALGOLIA_POSTS_INDEX_NAME = 'posts';

// Updates the search index when new blog entries are created or updated.
exports.indexentry = functions.database.ref('/posts/{postid}/tip').onWrite(event => {
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME);
  const firebaseObject = {
    coordinates: event.data.val().coordinates,
    likesTotal: event.data.val().likesTotal,
    published: event.data.val().published,
    rpublished: event.data.val().rpublished,
    location: event.data.val().location,
    user: event.data.val().user,
    userName: event.data.val().userName,
    tip: event.data.val().tip,
    objectID: event.params.postid
  };

  return index.saveObject(firebaseObject).then(
      () => event.data.adminRef.parent.child('published').set(
          Date.parse(event.timestamp)));
});

// Starts a search query whenever a query is requested (by adding one to the `/search/queries`
// element. Search results are then written under `/search/results`.
exports.searchentry = functions.database.ref('/search/queries/{queryid}').onWrite(event => {
  const index = client.initIndex(ALGOLIA_POSTS_INDEX_NAME);

  const query = event.data.val().query;
  const key = event.data.key;

  return index.search(query).then(content => {
    const updates = {
      '/search/last_query_timestamp': Date.parse(event.timestamp)
    };
    updates[`/search/results/${key}`] = content;
    return admin.database().ref().update(updates);
  });
});