var Poller = require("../src/Poller");
var sinon = require("sinon");

describe("Poller", () => {
  var poller;

  var callApiCallbackFn = sinon.spy(() => Promise.resolve());
  var clock;
  beforeEach(() => {
    clock = sinon.useFakeTimers();
    poller = new Poller({
      callApi: callApiCallbackFn,
      onSuccessResponse: function () { },
      delays: []
    });
  });

  afterEach(() => {
    clock.restore();
  });

  describe("#start", () => {
    it("starts polling", () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.start();
      expect(poller.timer).not.equal(null);
      expect(poller.pollCount).not.equal(2);
    });
    it("calls callApi when initCallApi not provided", function () {
      poller.start();
      clock.tick(510);
      expect(callApiCallbackFn).to.have.been.called();
    });

    it("calls initCallApi when provided", function () {
      var fn = sinon.spy(() => {
        return Promise.resolve();
      });
      anotherPoller = new Poller({
        initCallApi: fn,
        onSuccessResponse: function () { },
        delays: []
      });
      anotherPoller.start();
      clock.tick(510);
      expect(fn).to.have.been.called();
    });
  });

  describe("#reset", () => {
    it("sets pollCount to 0", () => {
      poller.pollCount = 6;
      poller.reset();
      expect(poller.pollCount).to.equal(0);
    });

    it("aborts last request call", () => {
      poller.abortLastFetch = sinon.spy();
      poller.reset();
      expect(poller.abortLastFetch).to.have.been.calledOnce();
    });
  });

  describe("#getProgress", function () {
    it("returns 100 when pollCount === pollLimit", () => {
      poller.pollLimit = 3;
      poller.pollCount = 3;
      expect(poller.getProgress()).to.equal(100);
    });
  });

  describe("#poll", () => {
    it("increases pollCount", () => {
      poller.pollCount = 1;
      poller.poll();
      expect(poller.pollCount).to.equal(2);
    });

    it("resets retryCount", () => {
      poller.retryCount = 2;
      poller.poll();
      expect(poller.retryCount).to.equal(0);
    });
  });

  describe("#preparePoll", () => {
    it("creates timer when pollCount is smaller than length of delays", () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.preparePoll();
      expect(poller.timer).not.equal(null);
    });

    it("does not create timer if pollCount is greater or equal to length of delays", () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 3;
      poller.timer = null;
      poller.preparePoll();
      expect(poller.timer).to.equal(null);
    });

    it("stop the polling process when client request", () => {
      poller.delays = [1, 2, 3, 4, 5];
      poller.pollCount = 3;
      poller.timer = null;
      poller.forceStop = true;
      poller.preparePoll();
      expect(poller.timer).to.equal(null);
    });
  });

  describe("#isLastPolling", () => {
    it("return true at the last polling", () => {
      poller.pollCount = 0;
      poller.pollLimit = 1;
      poller.poll();
      expect(poller.isLastPolling()).to.equal(true);
    });
  });

  describe("#retry", () => {
    var fn = sinon.spy(() => {
      return Promise.resolve();
    });
    it("increases retryCount", () => {
      poller.retryCount = 1;
      poller.retry(fn);
      expect(poller.retryCount).to.equal(2);
    });

    it("does nothing when reach the limit of retry", () => {
      poller.retryCount = 3;
      poller.retry(fn);
      expect(poller.retryCount).to.equal(3);
    });
  });

  describe("#handleSuccessResponse", () => {
    it("calls preparePoll", () => {
      poller.delays = [1, 2, 3];
      poller.pollCount = 1;
      poller.timer = null;
      poller.handleSuccessResponse({});
      expect(poller.timer).not.equal(null);
    });

    it("calls onSuccessResponse", () => {
      poller.onSuccessResponse = sinon.spy();
      var response = {};
      poller.handleSuccessResponse(response);
      expect(poller.onSuccessResponse).to.have.been.calledWith(response);
    });
  });
});
