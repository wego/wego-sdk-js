var sinon = require('sinon');
var HotelSearchClient = require('../../src/hotel-search/Client');

describe('HotelSearchClient', function() {
  var client;
  beforeEach(function() {
    client = new HotelSearchClient();
    mockAjaxCall(client);
  });

  function mockAjaxCall(client) {
    client._callApi = function() {};
  }

  describe('#reset', function() {
    it('reset lastRatesCount', function() {
      client.__lastRatesCount = 10;
      client.reset();
      expect(client.__lastRatesCount).to.equal(0);
    });

    it('set fetchCount to 0', function() {
      client.__fetchCount = 6;
      client.reset();
      expect(client.__fetchCount).to.equal(0);
    });

    it('#reset merger', function() {
      client.handleSearchResponse({
        brands: [
          { id: 1 }
        ]
      });

      client.reset();

      expect(client.__merger.__staticData.brands).to.deep.equal({});
    });

    it('abort last request call', function() {
      var abort = sinon.spy();
      client.__abortLastRequest = abort;
      client.reset();
      expect(abort).to.have.been.calledOnce;
    })
  });

  describe('#updateRateAmenityIds', function() {
    it('should reset and do new polling', function() {
      client.mergeResponse({
      });

      client.__timer = null;
      client.__fetchCount = 2;

      var rateAmenityIds = [];

      client.updateRateAmenityIds(rateAmenityIds);

      expect(client.rateAmenityIds).to.equal(rateAmenityIds);
      expect(client.__fetchCount).to.equal(0);
      expect(client.__timer).to.not.equal(null);
    });
  });

  it('#updateSort', function() {
    var hotels;
    var client = new HotelSearchClient({
      onHotelsChanged: function(_hotels) {
        hotels = _hotels;
      }
    });

    mockAjaxCall(client);

    var hotel1 = {
      id: 1,
      star: 1,
    };

    var hotel2 = {
      id: 2,
      star: 2,
    };

    client.mergeResponse({
      hotels: [hotel1, hotel2],
    });

    client.updateSort({
      by: 'STAR',
      order: 'DESC',
    });

    var hotelIds = hotels.map(function(hotel) { return hotel.id });

    expect(hotelIds).to.deep.equal([2, 1]);
  });

  it('#updateFilter', function() {
    var hotels;
    var client = new HotelSearchClient({
      onHotelsChanged: function(_hotels) {
        hotels = _hotels;
      }
    });

    mockAjaxCall(client);

    var hotel1 = {
      id: 1,
      districtId: 1,
    };

    var hotel2 = {
      id: 2,
      districtId: 2,
    };

    client.mergeResponse({
      hotels: [hotel1, hotel2],
    });

    client.updateFilter({
      districtIds: [2],
    });

    var hotelIds = hotels.map(function(hotel) { return hotel.id });

    expect(hotelIds).to.deep.equal([2]);
  });

  it('#updateCurrency', function() {
    var hotels, filter;
    var client = new HotelSearchClient({
      onHotelsChanged: function(_hotels) {
        hotels = _hotels;
      },
      onDisplayedFilterChanged: function(_filter) {
        filter = _filter;
      }
    });

    mockAjaxCall(client);


    var hotel = {
      id: 1,
    };

    client.handleSearchResponse({
      hotels: [hotel],
      rates: [
        {
          hotelId: 1,
          price: {
            currencyCode: 'SGD',
            amount: 1000,
            amountUsd: 100,
          },
        },
      ],
    });


    client.updateCurrency({
      code: 'VND',
      rate: 2
    });

    expect(hotels[0].rates[0].price.amount).to.equal(200);
  });

  describe('#searchHotels', function() {
    it('reset state', function() {
      client.__fetchCount = 5;
      client.searchHotels({});
      expect(client.__fetchCount).to.equal(0);
    });

    it('prepare fetch', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 1;
      client.__timer = null;
      client.searchHotels({});
      expect(client.__timer).not.equal(null);
    })
  });

  describe('#handleSearchResponse', function() {
    it('prepare next fetch', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 1;
      client.__timer = null;
      client.handleSearchResponse({});
      expect(client.__timer).not.equal(null);
    });

    it('update lastRatesCount', function() {
      var lastRatesCount = 10;

      client.handleSearchResponse({
        count: lastRatesCount,
      });

      expect(client.__lastRatesCount).to.equal(lastRatesCount);
    });

    it('onDisplayedFilterChanged', function() {
      var price = {};
      var displayedFilter;

      var client = new HotelSearchClient({
        onDisplayedFilterChanged: function(filter) {
          displayedFilter = filter;
        }
      });

      mockAjaxCall(client);

      client.handleSearchResponse({
        filter: {
          minPrice: price,
        },
      });

      expect(displayedFilter.minPrice).to.equal(price);
    });

    it('onHotelsChanged', function() {
      var hotel = {
        id: 1,
      };

      var hotels;

      client = new HotelSearchClient({
        onHotelsChanged: function(_hotels) {
          hotels = _hotels;
        }
      });

      mockAjaxCall(client);

      client.handleSearchResponse({
        hotels: [hotel],
        rates: [
          {
            hotelId: 1,
            price: {},
          }
        ]
      });

      var hotelIds = hotels.map(function(hotel) { return hotel.id });
      expect(hotelIds).to.deep.equal([1]);
    });
  });

  describe('#handleSearchError', function() {
    it('increase __retryCount', function() {
      client.__retryCount = 1;
      client.handleSearchError();
      expect(client.__retryCount).to.equal(2);
    });

    it('do nothing when reach the limit of retry', function() {
      client.__retryCount = 3;
      client.handleSearchError();
      expect(client.__retryCount).to.equal(3);
    })
  });

  it('#_fetch', function() {
    client = new HotelSearchClient({
      locale: 'en',
      currency: {
        code: 'SGD'
      },
      host: 'http://host'
    });

    mockAjaxCall(client);

    client.__fetchCount = 1;
    client.__retryCount = 2;

    client._fetch();

    expect(client.__fetchCount).to.equal(2);
    expect(client.__retryCount).to.equal(0);
  });

  describe('#_prepareFetch', function() {
    it('create timer if fetchCount is smaller than length of delays', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 1;
      client.__timer = null;
      client._prepareFetch();
      expect(client.__timer).not.equal(null);
    });

    it('not create timer if fetchCount is greater or equal to length of delays', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 3;
      client.__timer = null;
      client._prepareFetch();
      expect(client.__timer).to.equal(null);
    });
  });

  it('#_getSearchRequestBody', function() {
    var lastRatesCount = 10;
    var locale = 'en';
    var currencyCode = 'currencyCode';
    var siteCode = 'SGD';
    var cityCode = 'cd';
    var roomsCount = 1;
    var guestsCount = 2;
    var checkIn = '2017-02-07';
    var checkOut = '2017-02-07';
    var countryCode = 'SG';
    var rateAmenityIds = [1, 2, 3];
    var deviceType = 'desktop';
    var appType = 'IOS_APP';
    var searchId = 111;

    var responseSearch = {
      id: searchId,
    };


    var client = new HotelSearchClient({
      siteCode: siteCode,
      deviceType: deviceType,
      appType: appType,
      locale: locale,
      currency: {
        code: currencyCode
      }
    });

    client.rateAmenityIds = rateAmenityIds;

    client.search = {
      cityCode: cityCode,
      roomsCount: roomsCount,
      guestsCount: guestsCount,
      checkIn: checkIn,
      checkOut: checkOut,
      countryCode: countryCode,
    };

    client.__responseSearch = responseSearch;
    client.__lastRatesCount = lastRatesCount;

    var requestBody = client._getSearchRequestBody();
    var requestSearch = requestBody.search;

    expect(requestBody.rateAmenityIds).to.deep.equal(rateAmenityIds);
    expect(requestBody.offset).to.equal(lastRatesCount);
    expect(requestSearch.id).to.equal(searchId);
    expect(requestSearch.cityCode).to.equal(cityCode);
    expect(requestSearch.locale).to.equal(locale);
    expect(requestSearch.currencyCode).to.equal(currencyCode);
    expect(requestSearch.siteCode).to.equal(siteCode);
    expect(requestSearch.roomsCount).to.equal(roomsCount);
    expect(requestSearch.guestsCount).to.equal(guestsCount);
    expect(requestSearch.checkIn).to.equal(checkIn);
    expect(requestSearch.checkOut).to.equal(checkOut);
    expect(requestSearch.countryCode).to.equal(countryCode);
    expect(requestSearch.deviceType).to.equal(deviceType);
    expect(requestSearch.appType).to.equal(appType);
  });

  describe('#mergerRespnose', function() {
    it('responseSearch', function() {
      var search = {};
      client.handleSearchResponse({
        search: search,
      });

      expect(client.__responseSearch).to.equal(search);
    });

    it('lastRatesCount', function() {
      var lastRatesCount = 15;
      client.handleSearchResponse({
        count: lastRatesCount,
      });
      expect(client.__lastRatesCount).to.equal(lastRatesCount);
    });

    it('merge response by merger', function() {
      var brand = {
        id: 1
      };

      client.handleSearchResponse({
        brands: [brand]
      });

      expect(client.__merger.__staticData.brands[1]).to.equal(brand);
    });
  });

  describe('update progress', function() {
    var progress;
    beforeEach(function() {
      progress = 0;
      client = new HotelSearchClient({
        onProgressChanged: function(_progress) {
          progress = _progress;
        }
      });
      mockAjaxCall(client);
    });

    it('when smaller then 100', function() {
      client.__progressStopAfter = 10;
      client.__fetchCount = 4;
      client.handleSearchResponse({
        count: 200,
      });
      expect(progress).to.equal(30);
    });

    it('should update to 100 when __fetchCount >= __progressStopAfter', function() {
      client.__progressStopAfter = 3;
      client.__fetchCount = 3;
      client.updateProgress();
      expect(progress).to.equal(100);
    });

    it('should update to 100 when __lastRatesCount >= 1000', function() {
      client.__lastRatesCount = 1000;
      client.updateProgress();
      expect(progress).to.equal(100);
    });
  });

  describe('#updateResults', function() {
    it('totalHotels', function() {
      var hotels;

      var client = new HotelSearchClient({
        onTotalHotelsChanged: function(_hotels) {
          hotels = _hotels;
        }
      });

      var hotel = { id: 1 };

      client.handleSearchResponse({
        hotels: [hotel],
      });

      var hotelIds = hotels.map(function(hotel) {
        return hotel.id;
      });

      expect(hotelIds).to.deep.equal([1]);
    });

    it('hotels', function() {
      var hotels;
      var client = new HotelSearchClient({
        onHotelsChanged: function(_hotels) {
          hotels = _hotels;
        }
      });

      mockAjaxCall(client);

      var rate1 = {
        id: 1,
        hotelId: 1,
        price:  {
          amountUsd: 100,
        },
      };

      var hotel1 = { id: 1 };

      var rate2 = {
        id: 2,
        hotelId: 2,
        price:  {
          amountUsd: 70,
        },
      };

      var hotel2 = { id: 2 };

      var hotel3 = { id: 3 };

      client.sort = {
        by: 'PRICE',
        order: 'ASC'
      };

      client.currency = {
        rate: 2,
      };

      client.updateFilter({
        priceRange: {
          min: 60,
          max: 120,
        }
      });

      client.handleSearchResponse({
        rates: [rate1, rate2],
        hotels: [hotel1, hotel2, hotel3],
      });

      var hotelIds = hotels.map(function(hotel) {
        return hotel.id;
      });

      expect(hotelIds).to.deep.equal([2, 1]);
    });
  });
});