var Poller = require('../src/Poller');
var sinon = require('sinon');

describe('Poller', () => {
  var poller;

  beforeEach(() => {
    poller = new Poller({
      callApi: function() {
        return Promise.resolve();
      },
      onSuccessResponse: function() {
      },
      delays: [],
    });
  });

  describe('#start', () => {
    it('calls preparePoll', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.start();
      expect(poller.timer).not.equal(null);
    });
  });

  describe('#reset', () => {
    it('sets pollCount to 0', () => {
      poller.pollCount = 6;
      poller.reset();
      expect(poller.pollCount).to.equal(0);
    });

    it('aborts last request call', () => {
      poller.abortLastFetch = sinon.spy();
      poller.reset();
      expect(poller.abortLastFetch).to.have.been.calledOnce();
    });

    it('sets count to 0', function() {
      poller.resultCount = 10;
      poller.reset();
      expect(poller.resultCount).to.equal(0);
    });
  });

  describe('#getProgress', function() {
    it('is computed by both fetch count and count', function() {
      poller.pollLimit = 10;
      poller.pollCount = 4;
      poller.resultCount = 200;
      expect(poller.getProgress()).to.equal(30);
    });

    it('returns 100 when pollCount >= pollLimit', () => {
      poller.pollLimit = 3;
      poller.pollCount = 3;
      expect(poller.getProgress()).to.equal(100);
    });

    it('returns 100 when count >= 1000', function() {
      poller.resultCount = 1000;
      expect(poller.getProgress()).to.equal(100);
    });
  });

  describe('#poll', () => {
    it('increases pollCount', () => {
      poller.pollCount = 1;
      poller.poll();
      expect(poller.pollCount).to.equal(2);
    });

    it('resets retryCount', () => {
      poller.retryCount = 2;
      poller.poll();
      expect(poller.retryCount).to.equal(0);
    });
  });

  describe('#preparePoll', () => {
    it('creates timer when pollCount is smaller than length of delays', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.preparePoll();
      expect(poller.timer).not.equal(null);
    });

    it('does not create timer if pollCount is greater or equal to length of delays', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 3;
      poller.timer = null;
      poller.preparePoll();
      expect(poller.timer).to.equal(null);
    });
  });

  describe('#hanldeErrorResponse', () => {
    it('increases retryCount', () => {
      poller.retryCount = 1;
      poller.handleErrorResponse();
      expect(poller.retryCount).to.equal(2);
    });

    it('does nothing when reach the limit of retry', () => {
      poller.retryCount = 3;
      poller.handleErrorResponse();
      expect(poller.retryCount).to.equal(3);
    })
  });

  describe('#handleSuccessResponse', () => {
    it('calls preparePoll', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.handleSuccessResponse({});
      expect(poller.timer).not.equal(null);
    });

    it('sets count', () => {
      var count = 100;
      poller.handleSuccessResponse({
        count: count,
      });
      expect(poller.resultCount).to.equal(count);
    });

    it('calls onSuccessResponse', () => {
      poller.onSuccessResponse = sinon.spy();
      var response = {};
      poller.handleSuccessResponse(response);
      expect(poller.onSuccessResponse).to.have.been.calledWith(response);
    })
  });
});