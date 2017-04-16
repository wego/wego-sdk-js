var Poller = function (options) {
  options = options || {};
  this.callApi = options.callApi;
  this.delays = options.delays;
  this.onSuccessResponse = options.onSuccessResponse;
  this.pollLimit = options.pollLimit;
};

Poller.prototype = {
  start: function() {
    this.preparePoll();
  },

  reset: function() {
    clearTimeout(this.timer);
    if (this.abortLastFetch) {
      this.abortLastFetch();
    }
    this.pollCount = 0;
    this.resultCount = 0;
  },

  getProgress: function() {
    if (this.pollCount >= this.pollLimit || this.resultCount >= 1000) {
      return 100;
    }

    return this.pollCount / this.pollLimit * 50 + this.resultCount / 1000 * 50;
  },

  handleSuccessResponse: function(response) {
    this.onSuccessResponse(response);
    this.resultCount = response.count;
    this.preparePoll();
  },

  handleErrorResponse: function() {
    this.retry();
  },

  preparePoll: function() {
    var self = this;
    if (this.pollCount < this.delays.length) {
      this.timer = setTimeout(function() {
        self.poll();
      }, this.delays[this.pollCount]);
    }
  },

  poll: function() {
    this.pollCount++;
    this.retryCount = 0;
    this.fetch();
  },

  retry: function() {
    if (this.retryCount < 3) {
      this.retryCount++;
      this.fetch();
    }
  },

  fetch: function() {
    var self = this;
    var aborted = false;
    this.abortLastFetch = function() {
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