'use strict';

var User = function (data) {
  this.data = data;
};

User.prototype.getCountry = function () {
  return this.data.country;
};