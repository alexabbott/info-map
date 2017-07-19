// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyCjV1QF1t8-EHtNJRSj0TuVEXBVHNg8LAA",
    authDomain: "bynd-map.firebaseapp.com",
    databaseURL: "https://bynd-map.firebaseio.com",
    projectId: "bynd-map",
    storageBucket: "bynd-map.appspot.com",
    messagingSenderId: "637854657898"
  },
  googleMaps: {
    apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyD9e_lkQIiKtphl0vGK3MjbC589jQcRtvk&libraries=places'
  }
};
