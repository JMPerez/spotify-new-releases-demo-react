/*global OAuthConfig*/
var target = window.self === window.top ? window.opener : window.parent;

/**
 * Obtains parameters from the hash of the URL
 * @return Object
 */
function getHashParams() {
  var hashParams = {};
  var e, r = /([^&;=]+)=?([^&;]*)/g,
      q = window.location.hash.substring(1);
  while ( e = r.exec(q)) {
     hashParams[e[1]] = decodeURIComponent(e[2]);
  }
  return hashParams;
}

var params = getHashParams(),
    accessToken = params.access_token,
    state = params.state,
    storedState = localStorage.getItem(OAuthConfig.stateKey);

if (accessToken && (state === undefined || state !== storedState)) {
  target.postMessage(JSON.stringify(
     {
      type: 'token',
      success: false,
      message: 'error'
    }), OAuthConfig.host);
  } else {
    localStorage.removeItem(OAuthConfig.stateKey);
    target.postMessage(JSON.stringify({
      type: 'token',
      success: true,
      token: accessToken
    }), OAuthConfig.host);
  }
