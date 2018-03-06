var sinon = require("sinon");
var HotelSearchClient = require("../../src/hotel-search/Client");

describe("HotelSearchClient", function() {
  var client;
  beforeEach(function() {
    client = new HotelSearchClient();
    mockAjaxCall(client);
  });

  function mockAjaxCall(client) {
    client._callApi = function() {};
  }

  describe("#reset", function() {
    it("reset lastRatesCount", function() {
      client.lastRatesCount = 10;
      client.reset();
      expect(client.lastRatesCount).to.equal(0);
    });

    it("resets poller", function() {
      client.poller.pollCount = 4;
      client.reset();
      expect(client.poller.pollCount).to.equal(0);
    });

    it("#reset merger", function() {
      client.handleSearchResponse({
        brands: [{ id: 1 }]
      });

      client.reset();

      expect(client.merger.__staticData.brands).to.deep.equal({});
    });

    it("abort last request call", function() {
      var abort = sinon.spy();
      client.__abortLastRequest = abort;
      client.reset();
      expect(abort).to.have.been.calledOnce;
    });
  });

  it("#updateSort", function() {
    var hotels;
    var client = new HotelSearchClient({
      onHotelsChanged: function(_hotels) {
        hotels = _hotels;
      }
    });

    mockAjaxCall(client);

    var hotel1 = {
      id: 1,
      star: 1
    };

    var hotel2 = {
      id: 2,
      star: 2
    };

    client.mergeResponse({
      hotels: [hotel1, hotel2]
    });

    client.updateSort({
      by: "STAR",
      order: "DESC"
    });

    var hotelIds = hotels.map(function(hotel) {
      return hotel.id;
    });

    expect(hotelIds).to.deep.equal([2, 1]);
  });

  it("#updateFilter", function() {
    var hotels;
    var client = new HotelSearchClient({
      onHotelsChanged: function(_hotels) {
        hotels = _hotels;
      }
    });

    mockAjaxCall(client);

    var hotel1 = {
      id: 1,
      districtId: 1
    };

    var hotel2 = {
      id: 2,
      districtId: 2
    };

    client.mergeResponse({
      hotels: [hotel1, hotel2]
    });

    client.updateFilter({
      districtIds: [2]
    });

    var hotelIds = hotels.map(function(hotel) {
      return hotel.id;
    });

    expect(hotelIds).to.deep.equal([2]);
  });

  it("#updateCurrency", function() {
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
      id: 1
    };

    client.handleSearchResponse({
      hotels: [hotel],
      rates: [
        {
          hotelId: 1,
          price: {
            currencyCode: "SGD",
            amount: 1000,
            amountUsd: 100
          }
        }
      ]
    });

    client.updateCurrency({
      code: "VND",
      rate: 2
    });

    expect(hotels[0].rates[0].price.amount).to.equal(200);
  });

  describe("#searchHotels", function() {
    it("start poller", function() {
      client.poller.timer = null;
      client.searchHotels({});
      expect(client.poller.timer).not.equal(null);
    });
  });

  describe("#handleSearchResponse", function() {
    it("update lastRatesCount", function() {
      var lastRatesCount = 10;

      client.handleSearchResponse({
        count: lastRatesCount
      });

      expect(client.lastRatesCount).to.equal(lastRatesCount);
    });

    it("onDisplayedFilterChanged", function() {
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
          minPrice: price
        }
      });

      expect(displayedFilter.minPrice).to.equal(price);
    });

    it("onHotelsChanged", function() {
      var hotel = {
        id: 1
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
            price: {}
          }
        ]
      });

      var hotelIds = hotels.map(function(hotel) {
        return hotel.id;
      });
      expect(hotelIds).to.deep.equal([1]);
    });
  });

  describe("#getSearchRequestBody", function() {
    var lastRatesCount = 10,
      locale = "en",
      currencyCode = "currencyCode",
      siteCode = "SGD",
      cityCode = "cd",
      rooms = [{
        "adultsCount": 1,
        "childrenCount": 0,
        "childrenAges": []
      }],
      checkIn = "2017-02-07",
      checkOut = "2017-02-07",
      countryCode = "SG",
      deviceType = "desktop",
      appType = "IOS_APP",
      searchId = 111,
      selectedHotelIds = ["957766"],
      responseSearch = {
        id: searchId
      },
      client = new HotelSearchClient({
        siteCode: siteCode,
        deviceType: deviceType,
        appType: appType,
        locale: locale,
        currency: {
          code: currencyCode
        }
      });

    client.search = {
      cityCode: cityCode,
      rooms: rooms,
      checkIn: checkIn,
      checkOut: checkOut,
      countryCode: countryCode
    };

    client.responseSearch = responseSearch;
    client.lastRatesCount = lastRatesCount;

    it("passes the correct parameters", function() {
      var requestBody = client.getSearchRequestBody(),
        requestSearch = requestBody.search;

      expect(requestBody.offset).to.equal(lastRatesCount);
      expect(requestSearch.id).to.equal(searchId);
      expect(requestSearch.cityCode).to.equal(cityCode);
      expect(requestSearch.locale).to.equal(locale);
      expect(requestSearch.currencyCode).to.equal(currencyCode);
      expect(requestSearch.siteCode).to.equal(siteCode);
      expect(requestSearch.rooms).to.equal(rooms);
      expect(requestSearch.checkIn).to.equal(checkIn);
      expect(requestSearch.checkOut).to.equal(checkOut);
      expect(requestSearch.countryCode).to.equal(countryCode);
      expect(requestSearch.deviceType).to.equal(deviceType);
      expect(requestSearch.appType).to.equal(appType);
    });

    it("allows to pass an array of selectedHotelIds", function() {
      client.selectedHotelIds = selectedHotelIds;

      var requestBody = client.getSearchRequestBody();

      expect(requestBody.selectedHotelIds).to.deep.equal(selectedHotelIds);
    });

    it("does not allow to pass a string of selectedHotelIds", function() {
      client.selectedHotelIds = "957766";

      var requestBody = client.getSearchRequestBody();

      expect(requestBody.selectedHotelIds).to.equal(undefined);
    });

    it("return isLastPolling flag at the last polling request", function() {
      client.poller.pollCount = 2;
      client.poller.pollLimit = 1;
      var params = client.fetchHotelsParams();
      expect(params.isLastPolling).to.equal(true);
    });
  });

  describe("#mergeResponse", function() {
    it("responseSearch", function() {
      var search = {};
      client.handleSearchResponse({
        search: search
      });

      expect(client.responseSearch).to.equal(search);
    });

    it("lastRatesCount", function() {
      var lastRatesCount = 15;
      client.handleSearchResponse({
        count: lastRatesCount
      });
      expect(client.lastRatesCount).to.equal(lastRatesCount);
    });

    it("merge response by merger", function() {
      var brand = {
        id: 1
      };

      client.handleSearchResponse({
        brands: [brand]
      });

      expect(client.merger.__staticData.brands[1]).to.equal(brand);
    });

    it("no hotel can have more than 1 rate from a provider when search's status is not'done'", () => {
      var response = {
        done: false,
        hotels: [{ id: 1},{ id: 2}],
        rates: [
          { id: 1, hotelId: 1, providerCode: "a.com", price: {amount: 100, taxAmountUsd: 1}},
          { id: 2, hotelId: 1, providerCode: "a.com", price: {amount: 110, taxAmountUsd: 1}},
          { id: 3, hotelId: 2, providerCode: "a.com", price: {amount: 120, taxAmountUsd: 1}},
          { id: 4, hotelId: 2, providerCode: "b.com", price: {amount: 130, taxAmountUsd: 1}},
          { id: 5, hotelId: 1, providerCode: "a.com", price: {amount: 140, taxAmountUsd: 1}},
        ]
      }
      client.poller.pollCount = 1;
      client.poller.pollLimit = 3;
      client.handleSearchResponse(response);
      expect(client.merger.__hotelMap[1].rates.length).to.equal(1);
      expect(client.merger.__hotelMap[2].rates.length).to.equal(2);
      expect(client.merger.__hotelMap[2].rates[0].providerCode).to.not.equal(
        client.merger.__hotelMap[2].rates[1].providerCode);
    });
    it("some hotels may have more than 1 from a provider rate when search's status is not 'done' but reaching limit polling time", () => {
      var response = {
        done: true,
        hotels: [{ id: 1},{ id: 2}],
        rates: [
          { id: 1, hotelId: 1, providerCode: "a.com", price: {amount: 100, taxAmountUsd: 1}},
          { id: 2, hotelId: 1, providerCode: "a.com", price: {amount: 110, taxAmountUsd: 1}},
          { id: 3, hotelId: 2, providerCode: "a.com", price: {amount: 120, taxAmountUsd: 1}},
          { id: 4, hotelId: 2, providerCode: "b.com", price: {amount: 130, taxAmountUsd: 1}},
          { id: 5, hotelId: 1, providerCode: "a.com", price: {amount: 140, taxAmountUsd: 1}},
        ]
      }
      client.poller.pollCount = 2;
      client.poller.pollLimit = 1;
      client.handleSearchResponse(response);
      expect(client.merger.__hotelMap[1].rates.length).to.equal(3);
      expect(client.merger.__hotelMap[2].rates.length).to.equal(2);
    });
    it("some hotels may have more than 1 from a provider rate when search's status is 'done'", () => {
      var response = {
        done: true,
        hotels: [{ id: 1},{ id: 2}],
        rates: [
          { id: 1, hotelId: 1, providerCode: "a.com", price: {amount: 100, taxAmountUsd: 1}},
          { id: 2, hotelId: 1, providerCode: "a.com", price: {amount: 110, taxAmountUsd: 1}},
          { id: 3, hotelId: 2, providerCode: "a.com", price: {amount: 120, taxAmountUsd: 1}},
          { id: 4, hotelId: 2, providerCode: "b.com", price: {amount: 130, taxAmountUsd: 1}},
          { id: 5, hotelId: 1, providerCode: "a.com", price: {amount: 140, taxAmountUsd: 1}},
        ]
      }
      client.handleSearchResponse(response);
      expect(client.merger.__hotelMap[1].rates.length).to.equal(3);
      expect(client.merger.__hotelMap[2].rates.length).to.equal(2);
    });
  });

  describe("#updateResults", function() {
    it("totalHotels", function() {
      var hotels;

      var client = new HotelSearchClient({
        onTotalHotelsChanged: function(_hotels) {
          hotels = _hotels;
        }
      });

      var hotel = { id: 1 };

      client.handleSearchResponse({
        hotels: [hotel]
      });

      var hotelIds = hotels.map(function(hotel) {
        return hotel.id;
      });

      expect(hotelIds).to.deep.equal([1]);
    });

    it("hotels", function() {
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
        price: {
          amountUsd: 100
        }
      };

      var hotel1 = { id: 1 };

      var rate2 = {
        id: 2,
        hotelId: 2,
        price: {
          amountUsd: 70
        }
      };

      var hotel2 = { id: 2 };

      var hotel3 = { id: 3 };

      client.sort = {
        by: "PRICE",
        order: "ASC"
      };

      client.currency = {
        rate: 2
      };

      client.updateFilter({
        priceRange: {
          min: 60,
          max: 120
        }
      });

      client.handleSearchResponse({
        rates: [rate1, rate2],
        hotels: [hotel1, hotel2, hotel3]
      });

      var hotelIds = hotels.map(function(hotel) {
        return hotel.id;
      });

      expect(hotelIds).to.deep.equal([2, 1]);
    });

    it("calls onProgressChanged", () => {
      var onProgressChanged = sinon.spy();
      client = new HotelSearchClient({
        onProgressChanged: onProgressChanged
      });
      client.poller.fetchCount = 10;
      client.handleSearchResponse({});
      expect(onProgressChanged).to.have.been.calledOnce();
    });
  });

  describe("#fetchHotelsParams", function() {
    var lastRatesCount = 10;
    var locale = "ar";
    var currencyCode = "currencyCode";
    var siteCode = "SGD";
    var cityCode = "cd";
    var rooms = [{
      adultsCount: 1,
      childrenCount: 0,
      childrenAges: []
    }];
    var checkIn = "2017-02-07";
    var checkOut = "2017-02-07";
    var countryCode = "SG";
    var deviceType = "desktop";
    var appType = "IOS_APP";
    var searchId = 111;
    var client = new HotelSearchClient({
      siteCode: siteCode,
      deviceType: deviceType,
      appType: appType,
      locale: locale,
      currency: {
        code: currencyCode
      }
    });

    client.lastRatesCount = lastRatesCount;

    it("returns offset", function() {
      var params = client.fetchHotelsParams();
      expect(params.offset).to.equal(lastRatesCount);
    });
    it("returns locale", function() {
      var params = client.fetchHotelsParams();
      expect(params.locale).to.equal(locale);
    });
    it("returns currencyCode", function() {
      var params = client.fetchHotelsParams();
      expect(params.currencyCode).to.equal(currencyCode);
    });
    it("has not selectedHotelIds", function() {
      var params = client.fetchHotelsParams();
      expect(params.selectedHotelIds).to.equal(undefined);
    });
    it("returns selectedHotelIds", function() {
      var client = new HotelSearchClient({
        siteCode: siteCode,
        deviceType: deviceType,
        appType: appType,
        locale: locale,
        currency: {
          code: currencyCode
        },
        selectedHotelIds: ["957766"]
      });
      var params = client.fetchHotelsParams();
      expect(params.selectedHotelIds).to.deep.equal(["957766"]);
    });
  });
});
