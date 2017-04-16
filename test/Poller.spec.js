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
    it('calls prepareFetch', () => {
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
      poller.abortLastPoll = sinon.spy();
      poller.reset();
      expect(poller.abortLastPoll).to.have.been.calledOnce();
    });

    it('sets count to 0', function() {
      poller.count = 10;
      poller.reset();
      expect(poller.count).to.equal(0);
    });
  });

  describe('#progress', function() {
    it('is computed by both fetch count and count', function() {
      poller.pollLimit = 10;
      poller.pollCount = 4;
      poller.count = 200;
      expect(poller.progress()).to.equal(30);
    });

    it('returns 100 when pollCount >= pollLimit', () => {
      poller.pollLimit = 3;
      poller.pollCount = 3;
      expect(poller.progress()).to.equal(100);
    });

    it('returns 100 when count >= 1000', function() {
      poller.count = 1000;
      expect(poller.progress()).to.equal(100);
    });
  });

  describe('#fetch', () => {
    it('increases pollCount', () => {
      poller.pollCount = 1;
      poller.fetch();
      expect(poller.pollCount).to.equal(2);
    });

    it('resets retryCount', () => {
      poller.retryCount = 2;
      poller.fetch();
      expect(poller.retryCount).to.equal(0);
    });
  });

  describe('#prepareFetch', () => {
    it('creates timer when pollCount is smaller than length of delays', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.prepareFetch();
      expect(poller.timer).not.equal(null);
    });

    it('does not create timer if pollCount is greater or equal to length of delays', () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 3;
      poller.timer = null;
      poller.prepareFetch();
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
    it('calls prepareFetch', () => {
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
      expect(poller.count).to.equal(count);
    });

    it('calls onSuccessResponse', () => {
      poller.onSuccessResponse = sinon.spy();
      var response = {};
      poller.handleSuccessResponse(response);
      expect(poller.onSuccessResponse).to.have.been.calledWith(response);
    })
  });
});