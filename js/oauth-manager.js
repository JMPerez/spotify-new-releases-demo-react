/*global Promise, OAuthConfig*/
/*exported OAuthManager*/

var OAuthManager = (function() {
  'use strict';

  function toQueryString(obj) {
    var parts = [];
    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        parts.push(encodeURIComponent(i) +
                   '=' +
                   encodeURIComponent(obj[i]));
      }
    }
    return parts.join('&');
  }

  /**
   * Generates a random string containing numbers and letters
   * @param  {number} length The length of the string
   * @return {string} The generated string
   */
  function generateRandomString(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  function obtainToken(options) {
    options = options || {};

    var promise = new Promise(function(resolve, reject) {

      var authWindow = null,
      pollAuthWindowClosed = null;

      function receiveMessage(msg) {
        try {
          var jsonMsg = JSON.parse(msg.data);
          if (msg.origin === OAuthConfig.host &&
              jsonMsg.type === 'token') {
            clearInterval(pollAuthWindowClosed);
            if (authWindow !== null) {
              authWindow.close();
              authWindow = null;
            }

            window.removeEventListener('message',
                                       receiveMessage,
                                       false);

            if (jsonMsg.success) {
              resolve(jsonMsg.token);
            } else {
              reject(jsonMsg.message);
            }
          }
        } catch(e) {}
      }

      window.addEventListener('message',
                              receiveMessage,
                              false);

      var width = 400,
          height = 600,
          left = (screen.width / 2) - (width / 2),
          top = (screen.height / 2) - (height / 2),
          state = generateRandomString(10);

      localStorage.setItem(OAuthConfig.stateKey, state);

      /*jshint camelcase:false*/
      var params = {
        client_id: OAuthConfig.clientId,
        redirect_uri: OAuthConfig.redirectUri,
        response_type: 'token',
        state: state
      };

      if (options.scopes) {
        params.scope = options.scopes.join(' ');
      }

      authWindow = window.open(
                               'https://accounts.spotify.com/authorize?' + toQueryString(params),
                               'Spotify',
                               'menubar=no,location=no,resizable=no,scrollbars=no,status=no, width=' + width + ', height=' + height + ', top=' + top + ', left=' + left
                               );

      pollAuthWindowClosed = setInterval(function() {
        if (authWindow !== null) {
          if (authWindow.closed) {
            clearInterval(pollAuthWindowClosed);
            reject('access_denied');
          }
        }
      }, 1000);

    });

    return promise;
  }

  return {
    obtainToken: obtainToken
  };

})();