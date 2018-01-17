var Poller = function(options) {
  options = options || {};
  this.initCallApi = options.initCallApi;
  this.callApi = options.callApi;
  this.delays = options.delays;
  this.onSuccessResponse = options.onSuccessResponse;
  this.pollLimit = options.pollLimit;
};

Poller.prototype = {
  start: function() {
    var self = this;
    this.timer = setTimeout(function() {
      self.pollCount++;
      self.retryCount = 0;
      self.fetch(self.initCallApi || self.callApi);
    }, 0);
  },

  reset: function() {
    clearTimeout(this.timer);
    if (this.abortLastFetch) {
      this.abortLastFetch();
    }
    this.pollCount = 0;
    this.resultCount = 0;
    this.forceStop = false;
  },

  stop: function() {
    this.forceStop = true;
  },

  isStopping: function() {
    return this.forceStop;
  },

  getProgress: function() {
    if (this.pollCount >= this.pollLimit || this.resultCount >= 1000) {
      return 100;
    }

    if (this.resultCount === undefined) {
      return this.pollCount / this.pollLimit * 100;
    }
    return this.pollCount / this.pollLimit * 50 + this.resultCount / 1000 * 50;
  },

  handleSuccessResponse: function(response) {
    this.onSuccessResponse(response);
    this.resultCount = response.count;
    this.preparePoll();
  },

  preparePoll: function() {
    var self = this;
    if (this.pollCount < this.delays.length && !this.forceStop) {
      this.timer = setTimeout(function() {
        self.poll();
      }, this.delays[this.pollCount]);
    }
  },

  poll: function() {
    this.pollCount++;
    this.retryCount = 0;
    this.fetch(this.callApi);
  },

  retry: function(callApiFn) {
    if (this.retryCount < 3) {
      this.retryCount++;
      this.fetch(callApiFn);
    }
  },

  fetch: function(callApiFn) {
    var self = this;
    var aborted = false;
    this.abortLastFetch = function() {
      aborted = true;
    };

    callApiFn()
      .then(function(response) {
        if (!aborted) {
          self.handleSuccessResponse(response);
        }
      })
      .catch(function() {
        self.retry(callApiFn);
      });
  }
};

module.exports = Poller;
