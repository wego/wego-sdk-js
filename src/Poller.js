var Poller = function (options) {
  options = options || {};
  this.callApi = options.callApi;
  this.delays = options.delays;
  this.onSuccessResponse = options.onSuccessResponse;
  this.pollLimit = options.pollLimit;
};

Poller.prototype = {
  reset: function() {
    clearTimeout(this.timer);
    if (this.abortLastPoll) {
      this.abortLastPoll();
    }
    this.pollCount = 0;
    this.count = 0;
  },

  progress: function() {
    if (this.pollCount >= this.pollLimit || this.count >= 1000) {
      return 100;
    }

    return this.pollCount / this.pollLimit * 50 + this.count / 1000 * 50;
  },

  start: function() {
    this.prepareFetch();
  },

  prepareFetch: function() {
    var self = this;
    if (this.pollCount < this.delays.length) {
      this.timer = setTimeout(function() {
        self.fetch();
      }, this.delays[this.pollCount]);
    }
  },

  fetch: function() {
    this.pollCount++;
    this.retryCount = 0;
    this.poll();
  },

  handleErrorResponse: function() {
    this.retry();
  },

  handleSuccessResponse: function(response) {
    this.onSuccessResponse(response);
    this.count = response.count;
    this.prepareFetch();
  },

  retry: function() {
    if (this.retryCount < 3) {
      this.retryCount++;
      this.poll();
    }
  },

  poll: function() {
    var self = this;
    var aborted = false;
    this.abortLastPoll = function() {
      aborted = true;
    };

    this.callApi().then(function(response) {
      if (!aborted) {
        self.handleSuccessResponse(response);
      }
    }).catch(function() {
      self.handleErrorResponse();
    });
  },
};

module.exports = Poller;