var Api = require("../Api");

const endpoints = {
  signIn: "/users/oauth/token",
  signUp: "/sign_up",
  confirmation: "/resend_confirmation"
};

var UsersServiceClient = function(options = {}) {
  var self = this;
  this.accessToken = options.accessToken;
  this.locale = options.locale || "en";
};

UsersServiceClient.prototype = {
  authenticate: function(credentials) {
    var uri = Api.getHost("v1") + endpoints.signIn;
    return Api.post(credentials, uri).then(response => {
      this.auth = response;
      this.accessToken = response.accessToken;
      return response;
    });
  },
  signUp: function(credentials) {
    var uri = Api.getHost("v1") + endpoints.signUp;
    return Api.post(credentials, uri);
  },
  // TODO implementation
  changePassword: function() {
    if (!this.accessToken) {
      throw "User must be logged in to change password";
    }
  },
  // TODO implementation
  resetPassword: function() {
    if (!this.accessToken) {
      throw "User must be logged in to reset password";
    }
  },
  // TODO implementation
  resendConfirmationEmail: function() {
    if (!this.accessToken) {
      throw "User must be logged in to resend confirmation email";
    }
  }
};

module.exports = UsersServiceClient;
