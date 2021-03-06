const sinon = require('sinon');
const HotelDetailsClient = require('../../src/hotel-details/HotelDetailsClient');

describe('HotelDetailsClient', function () {
  const hotelDetailsEndpointUrl = 'https://srv.wegostaging.com/v3/metasearch/hotels';
  let client;

  beforeEach(function () {
    client = new HotelDetailsClient(hotelDetailsEndpointUrl);
    mockAjaxCall(client);
  });

  function mockAjaxCall(client) {
    client._callApi = function () { };
  }

  describe('#reset', function () {
    it('resets poller', function () {
      client.poller.pollCount = 4;
      client.reset();
      expect(client.poller.pollCount).to.equal(0);
    });

    it('abort last request call', function () {
      var abort = sinon.spy();
      client.__abortLastRequest = abort;
      client.reset();
      expect(abort).to.have.been.calledOnce;
    })
  });

  describe('#searchHotelRates', function () {
    it('start poller', function () {
      client.poller.timer = 0;
      client.poller.start();
      client.search = {
        hotelId: "258101"
      };
      expect(client.poller.timer).not.equal(0);
    })

    it('calls onProgressChanged', () => {
      var onProgressChanged = sinon.spy();
      client = new HotelDetailsClient(hotelDetailsEndpointUrl, {
        onProgressChanged: onProgressChanged
      });

      client.handleSearchResponse({});
      expect(onProgressChanged).to.have.been.calledOnce();
    });
  });

  it('#getSearchRequestBody', function () {
    var locale = 'en';
    var currencyCode = 'currencyCode';
    var hotelId = '258101';
    var siteCode = 'SGD';
    var cityCode = 'cd';
    var rooms = [{
      adultsCount: 1,
      childrenCount: 0,
      childrenAges: []
    }];
    var checkIn = '2017-02-07';
    var checkOut = '2017-02-07';
    var deviceType = 'desktop';
    var wgCampaign = 'test_campaign';

    var client = new HotelDetailsClient(hotelDetailsEndpointUrl, {
      siteCode: siteCode,
      deviceType: deviceType,
      locale: locale,
      currency: {
        code: currencyCode
      }
    });

    client.search = {
      hotelId: hotelId,
      cityCode: cityCode,
      rooms: rooms,
      checkIn: checkIn,
      checkOut: checkOut,
    };
    client.trackingParams = { wgCampaign: wgCampaign };

    var requestBody = client.getSearchRequestBody();
    var requestSearch = requestBody.search;

    expect(requestBody.includeDirect).to.equal(true);
    expect(requestSearch.cityCode).to.equal(cityCode);
    expect(requestSearch.locale).to.equal(locale);
    expect(requestSearch.currencyCode).to.equal(currencyCode);
    expect(requestSearch.hotelId).to.equal(hotelId);
    expect(requestSearch.siteCode).to.equal(siteCode);
    expect(requestSearch.rooms).to.equal(rooms);
    expect(requestSearch.checkIn).to.equal(checkIn);
    expect(requestSearch.checkOut).to.equal(checkOut);
    expect(requestSearch.deviceType).to.equal(deviceType);
  });
});
