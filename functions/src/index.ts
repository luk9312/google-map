import * as functions from 'firebase-functions';
import * as map from '@google/maps';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
map.createClient({
  key:'',
  Promise: Promise
})

map.elevationAlongPath({
  path:[[],[]],
  samples: 10
}).asPromise()
.then()
.catch()
