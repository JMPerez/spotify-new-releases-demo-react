/**
 * @jsx React.DOM
 */
'use strict';

var app = app || {};

(function() {
  'use strict';

  app.spotifyApi = new SpotifyWebApi();
  app.player = new Player();
  app.loggedInUser = null;

  var Login = app.Login;

  var NewReleasesApp = React.createClass({
    
    getInitialState: function () {
      return {
        currentPage: 0,
        data: []
      };
    },

    handleLoginChange: function (loggedIn) {
      this.setState({
        data: [],
        loggedIn: loggedIn
      });

      if (loggedIn) {
        this.handleLoadMoreSubmit();
      }
    },

    handleLoadMoreSubmit: function () {
      var pageSize = 20;
      var country = app.loggedInUser.getCountry();
      var self = this;
      app.spotifyApi.getNewReleases({
        country: country,
        offset: this.state.currentPage * pageSize,
        limit: pageSize
      }).then(function(data) {
        var ids = data.albums.items.map(function(i) { return i.id; });
        app.spotifyApi.getAlbums(ids).then(function(albums) {
          albums.albums.forEach(function(album) {
            if (album !== null) {
              this.state.data.push(album);
            }
          }.bind(this));
          this.setState({
            data: this.state.data,
            currentPage: this.state.currentPage+1
          });
        }.bind(this));
      }.bind(this));
    },

    render: function () {
      var content;
      if (this.state.loggedIn) {
        content = <div><AlbumsList data={this.state.data} /><LoadMoreForm onLoadMoreSubmit={this.handleLoadMoreSubmit} /></div>
      };
      return (
        <div>
          {content}  
          <Login onLoginChange={this.handleLoginChange}/>
        </div>
      );
    }
  });

  // todo: keep only one element playing - should move this to a parent property?
  var Album = React.createClass({
    handlePlay: function () {
      this.props.onStartPlaying(this.props.data);
    },

    render: function () {
      var cx = React.addons.classSet;
      var classes = cx({
        'thumbnail': true,
        active: this.props.data.active
      });

      return (
        <li className={classes} onClick={this.handlePlay}>
          <div>
            <img src={this.props.data.images[1].url} width="192" height="192" alt={this.props.data.name} />
            <div className="overlay">Play</div>
            <div className="caption">
              <strong className="album-name">
                <span>{this.props.data.name}</span>
              </strong>
              <span>{this.props.data.artists[0].name}</span>
            </div>
          </div>
        </li>
      );
    }
  });

  var AlbumsList = React.createClass({

    getInitialState: function () {
      return {};
    },

    componentDidMount: function () {
      app.player.onStopPlaying(function() {
        this.stopPlaying();
      }.bind(this));        
    },

    startPlaying: function (album) {
      this.setState({
        albumPlaying: album
      });
      app.player.play(album.tracks.items[0].preview_url);
    },

    stopPlaying: function () {
      this.setState({
        albumPlaying: null
      });
    },

    render: function () {
      var albumNodes = this.props.data.map(function (album) {
        album.active = this.state.albumPlaying && this.state.albumPlaying.id == album.id;

        return (
          <Album data={album} onStartPlaying={this.startPlaying} />
        );
      }, this);

      return (
        <div className="albums">
          {albumNodes}
        </div>
      );
    }
  });

  var LoadMoreForm = React.createClass({
    
    handleSubmit: function (e) {
      e.preventDefault();
      this.props.onLoadMoreSubmit();
    },
    
    render: function () {
      return (
        <form onSubmit={this.handleSubmit}>
          <input type="submit" className="btn btn-primary" value="Load more" />
        </form>
      );
    }
  });

  React.renderComponent(
    <NewReleasesApp />,
    document.getElementById('contents')
  );

})();