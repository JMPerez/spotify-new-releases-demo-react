/**
 * @jsx React.DOM
 */

'use strict';

var app = app || {};

(function() {
  'use strict';

  var LogoutButton = React.createClass({
    handleClick: function () {
      this.props.onLogout();
    },
    render: function () {
      return (
        <button id="login-button" className="btn" onClick={this.handleClick}>
          Log out
        </button>
      );
    }
  });

  var LoginButton = React.createClass({
    onTokenReceived: function (token) {
      this.props.onLoginSuccess(token);
    },
    onLoginError: function (error) {
      this.props.onLoginError(error);
    },
    handleClick: function () {
      var self = this;
      //  this.loginErrorMessage(null);
      OAuthManager.obtainToken({
        scopes: [
          /*
            the permission for reading public playlists is granted
            automatically when obtaining an access token through
            the user login form
            */
            'user-read-private'
          ]
        }).then(function(token) {
          self.onTokenReceived(token);
        }).catch(function(error) {
          self.onLoginError(error);
        });
    },

    render: function () {
      return (
        <div>
          <p>Login to find out the latest releases on Spotify in your country.</p>
          <button id="login-button" className="btn btn-primary" onClick={this.handleClick}>
            Log in with Spotify
          </button>
        </div>
      );
    }
  });

  var LoginErrorMessage = React.createClass({
    render: function () {
      return (
        this.props.loginErrorMessage ? 
          <div className="alert alert-danger">{this.props.loginErrorMessage}</div> : <div></div>
      );
    }
  });

  var Login = React.createClass({
    accessTokenKey: 'sp-access-token',

    componentDidMount: function () {
      if (this.accessTokenKey in localStorage) {
        this.handleLoginSuccess(localStorage[this.accessTokenKey]);
      }
    },

    getInitialState: function () {
      return {
        loggedIn: false
      };
    },

    handleLoginSuccess: function (token) {
      var self = this;
      localStorage.setItem(this.accessTokenKey, token);
      app.spotifyApi.setAccessToken(token);
      app.spotifyApi.getMe().then(function(data) {
        app.loggedInUser = new User(data);
        self.setState({loggedIn: true});
        self.props.onLoginChange(true);
      }).catch(function (e) {
        if (e.status === 401) {
          self.handleLogout();
        }
      });
    },
    handleLoginError: function (error) {
      this.setState({
        loggedIn: false,
        loginErrorMessage: error
      });
    },
    handleLogout: function (token) {
      localStorage.removeItem(this.accessTokenKey);
      this.setState({loggedIn: false});
      this.props.onLoginChange(false);
    },
    render: function () {
      var loginButton;
      if (this.state.loggedIn) {
        loginButton = <LogoutButton onLogout={this.handleLogout} />;
      } else {
        loginButton = <LoginButton onLoginSuccess={this.handleLoginSuccess} onLoginError={this.handleLoginError}/>;
      }
      return (
        <div id="login">
          <LoginErrorMessage text="loginErrorMessage" />
          {loginButton} 
        </div>
      );
    }
  });

  app.Login = Login;
})();