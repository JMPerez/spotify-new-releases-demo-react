'use strict';

var Player = function () {
  this._audio = null;
  this._onStop = null;
};

// add: onStopped
Player.prototype.play = function (url) {
  if (this._audio === null) {
    this._audio = new Audio(url);
    this._audio.src = url;
    this._audio.addEventListener('ended', function() {
      if (this._onStop) {
        this._onStop();
      }
    }.bind(this));

    this._audio.play();
  } else {
    if (url == this._audio.src) {
      if (!this._audio.paused) {
        this._audio.pause();
      } else {
        this._audio.play();
      }
    } else {
      this._audio.src = url;
      this._audio.play();
    }
  }
};

Player.prototype.onStopPlaying = function (callback) {
  this._onStop = callback;
};
