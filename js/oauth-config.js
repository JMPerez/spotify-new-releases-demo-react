/*exported OAuthConfig*/
var OAuthConfig = (function() {
  'use strict';

  /* replace these values with yours obtained in the
  "My Applications" section of the Spotify developer site */

  var clientId = 'b3e64e390a1449bfbbaf4075eb6bbab9';
  //var redirectUri = 'http://jmperezperez.com/spotify-new-releases-demo/callback.html';
  var redirectUri = 'http://localhost:8000/callback.html';

  var host = /http[s]?:\/\/[^/]+/.exec(redirectUri)[0];

  return {
    clientId: clientId,
    redirectUri: redirectUri,
    host: host,
    stateKey: 'spotify_auth_state'
  };
})();
