var sinon = require('sinon');
var FlightSearchClient = require('../../src/flight-search/Client');

describe('FlightSearchClient', function() {
  var client;
  beforeEach(function() {
    client = new FlightSearchClient();
    mockAjaxCall(client);
  });

  function mockAjaxCall(client) {
    client._callApi = function() {};
  }

  describe('#reset', function() {
    it('reset processedFaresCount', function() {
      client.__processedFaresCount = 10;
      client.reset();
      expect(client.__processedFaresCount).to.equal(0);
    });

    it('set fetchCount to 0', function() {
      client.__fetchCount = 6;
      client.reset();
      expect(client.__fetchCount).to.equal(0);
    });

    it('#reset merger', function() {
      client.handleSearchResponse({
        airports: [
          { id: 1 }
        ]
      });

      client.reset();

      expect(client.__merger.__staticData.airports).to.deep.equal({});
    });

    it('abort last request call', function() {
      var abort = sinon.spy();
      client.__abortLastRequest = abort;
      client.reset();
      expect(abort).to.have.been.calledOnce;
    })
  });

  describe('paymentMethodIds change', function() {
    it('should reset and do new polling', function() {
      client.mergeResponse({
      });

      client.__timer = null;
      client.__fetchCount = 2;

      client.updatePaymentMethodIds([]);

      expect(client.__fetchCount).to.equal(0);
      expect(client.__timer).to.not.equal(null);
    });
  });

  describe('providerTypes change', function() {
    it('should reset and do new polling', function() {
      client.mergeResponse({
      });

      client.__timer = null;
      client.__fetchCount = 2;

      client.updateProviderTypes([]);

      expect(client.__fetchCount).to.equal(0);
      expect(client.__timer).to.not.equal(null);
    });
  });

  it('#updateSort', function() {
    var trips;
    var client = new FlightSearchClient({
      onTripsChanged: function(_trips) {
        trips = _trips;
      }
    });

    mockAjaxCall(client);

    var legId1 = 1;
    var leg1 = {
      id: legId1,
      departureTimeMinutes: 1,
      segments: [
        {
          airlineCode: 1,
        }
      ],
    };

    var legId2 = 2;
    var leg2 = {
      id: legId2,
      departureTimeMinutes: 2,
      segments: [
        {
          airlineCode: 1,
        }
      ],
    };

    var trip1 = {
      id: 1,
      legIds: [legId1],
    };

    var trip2 = {
      id: 2,
      legIds: [legId2],
    };

    client.mergeResponse({
      legs: [leg1, leg2],
      trips: [trip1, trip2],
      fares: [
        {
          tripId: 1,
          price: {},
        },
        {
          tripId: 2,
          price: {},
        }
      ],
    });

    client.updateSort({
      by: 'OUTBOUND_DEPARTURE_TIME',
      order: 'DESC',
    });

    var tripIds = trips.map(function(trip) { return trip.id });

    expect(tripIds).to.deep.equal([2, 1]);
  });

  it('#updateFilter', function() {
    var trips;
    var client = new FlightSearchClient({
      onTripsChanged: function(_trips) {
        trips = _trips;
      }
    });

    mockAjaxCall(client);


    var trip1 = {
      id: 1,
      stopCode: 'DIRECT',
    };

    var trip2 = {
      id: 2,
      stopCode: 'ONE_STOP',
    };

    client.mergeResponse({
      trips: [trip1, trip2],
      fares: [
        {
          tripId: 1,
          price: {},
        },
        {
          tripId: 2,
          price: {},
        }
      ]
    });

    client.updateFilter({
      stopCodes: ['ONE_STOP'],
    });

    var tripIds = trips.map(function(trip) { return trip.id });

    expect(tripIds).to.deep.equal([2]);
  });

  it('#updateCurrency', function() {
    var trips, filter;
    var client = new FlightSearchClient({
      onTripsChanged: function(_trips) {
        trips = _trips;
      },
      onDisplayedFilterChanged: function(_filter) {
        filter = _filter;
      }
    });

    mockAjaxCall(client);


    var trip = {
      id: 1,
      stopCode: 'DIRECT',
    };

    client.handleSearchResponse({
      trips: [trip],
      fares: [
        {
          tripId: 1,
          price: {
            currencyCode: 'SGD',
            amount: 1000,
            amountUsd: 100,
          },
        },
      ],
      filters: {
        airlines: [
          {
            price: {
              currencyCode: 'SGD',
              amount: 1000,
              amountUsd: 50,
            }
          }
        ]
      }
    });


    client.updateCurrency({
      code: 'VND',
      rate: 2
    });

    expect(trips[0].fares[0].price.amount).to.equal(200);
    expect(filter.airlines[0].price.amount).to.equal(100);
  });

  describe('#searchTrips', function() {
    it('reset state', function() {
      client.__fetchCount = 5;
      client.searchTrips({});
      expect(client.__fetchCount).to.equal(0);
    });

    it('prepare fetch', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 1;
      client.__timer = null;
      client.searchTrips({});
      expect(client.__timer).not.equal(null);
    })
  });

  describe('handleSearchResponse', function() {
    it('prepare next fetch', function() {
      client.__delays = [1, 2, 3];
      client.__fetchCount = 1;
      client.__timer = null;
      client.handleSearchResponse({});
      expect(client.__timer).not.equal(null);
    });

    it('update processedFaresCount', function() {
      var processedFaresCount = 10;

      client.handleSearchResponse({
        count: processedFaresCount,
      });

      expect(client.__processedFaresCount).to.equal(processedFaresCount);
    });

    it('update displayed filter', function() {
      var price = {};
      var displayedFilter;

      var client = new FlightSearchClient({
        onDisplayedFilterChanged: function(filter) {
          displayedFilter = filter;
        }
      });

      mockAjaxCall(client);

      client.handleSearchResponse({
        filters: {
          minPrice: price,
        },
      });

      expect(displayedFilter.minPrice).to.equal(price);
    });

    it('update displayed flights', function() {
      var trip = {
        id: 1,
      };

      var trips;

      client = new FlightSearchClient({
        onTripsChanged: function(_trips) {
          trips = _trips;
        }
      });

      mockAjaxCall(client);

      client.handleSearchResponse({
        trips: [trip],
        fares: [
          {
            tripId: 1,
            price: {},
          }
        ]
      });

      var tripIds = trips.map(function(trip) { return trip.id });
      expect(tripIds).to.deep.equal([1]);
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
    client = new FlightSearchClient({
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

  describe('#_getSearchRequestBody', function() {
    it('search', function() {
      var searchId = 1;
      var cabin = 'ECONOMIC';
      var adultsCount = 2;
      var childrenCount = 3;
      var infantsCount = 4;
      var siteCode = 'SG';
      var currencyCode = 'SGD';
      var locale = 'en';

      var departureCityCode = 'C1';
      var departureAirportCode = 'C2';
      var arrivalCityCode = 'C3';
      var arrivalAirportCode = 'C4';
      var outboundDate = 'D1';
      var processedFaresCount = 100;
      var paymentMethodIds = [1, 2, 3];
      var providerTypes = ['ota', 'airline'];

      var currency = {
        code: currencyCode,
      };

      var client = new FlightSearchClient({
        locale: locale,
        siteCode: siteCode,
        currency: currency,
        paymentMethodIds: paymentMethodIds,
        providerTypes: providerTypes,
      });

      mockAjaxCall(client);

      client.__processedFaresCount = processedFaresCount;

      client.__responseSearch = {
        id: searchId,
      };

      client.search = {
        cabin: cabin,
        adultsCount: adultsCount,
        childrenCount: childrenCount,
        infantsCount: infantsCount,
        legs: [
          {
            departureCityCode: departureCityCode,
            departureAirportCode: departureAirportCode,
            arrivalCityCode: arrivalCityCode,
            arrivalAirportCode: arrivalAirportCode,
            outboundDate: outboundDate,
          }
        ]
      };

      var requestBody = client._getSearchRequestBody();

      var search = requestBody.search;
      expect(search.id).to.equal(searchId);
      expect(search.cabin).to.equal(cabin);
      expect(search.adultsCount).to.equal(adultsCount);
      expect(search.childrenCount).to.equal(childrenCount);
      expect(search.infantsCount).to.equal(infantsCount);
      expect(search.siteCode).to.equal(siteCode);
      expect(search.currencyCode).to.equal(currencyCode);
      expect(search.locale).to.equal(locale);

      var leg = search.legs[0];
      expect(leg.departureCityCode).to.equal(departureCityCode);
      expect(leg.departureAirportCode).to.equal(departureAirportCode);
      expect(leg.arrivalCityCode).to.equal(arrivalCityCode);
      expect(leg.arrivalAirportCode).to.equal(arrivalAirportCode);
      expect(leg.outboundDate).to.equal(outboundDate);

      expect(requestBody.offset).to.equal(processedFaresCount);
      expect(requestBody.paymentMethodIds).to.deep.equal(paymentMethodIds);
      expect(requestBody.providerTypes).to.equal(providerTypes);
    });
  });

  describe('#mergerRespnose', function() {
    it('responseSearch', function() {
      var search = {};
      client.handleSearchResponse({
        search: search,
      });

      expect(client.__responseSearch).to.equal(search);
    });

    it('processedFaresCount', function() {
      var processedFaresCount = 15;
      client.handleSearchResponse({
        count: processedFaresCount,
      });
      expect(client.__processedFaresCount).to.equal(processedFaresCount);
    });

    it('merge response by merger', function() {
      var airport = {
        id: 1
      };

      client.handleSearchResponse({
        airports: [airport]
      });

      expect(client.__merger.__staticData.airports[1]).to.equal(airport);
    });
  });

  describe('update progress', function() {
    var progress;
    beforeEach(function() {
      progress = 0;
      client = new FlightSearchClient({
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

    it('should update to 100 when __processedFaresCount >= 1000', function() {
      client.__processedFaresCount = 1000;
      client.updateProgress();
      expect(progress).to.equal(100);
    });
  });

  describe('#updateResults', function() {
    it('totalTrips', function() {
      var trips;

      var client = new FlightSearchClient({
        onTotalTripsChanged: function(_trips) {
          trips = _trips;
        }
      });

      var trip = { id: 1 };

      client.handleSearchResponse({
        trips: [trip],
      });

      var tripIds = trips.map(function(trip) {
        return trip.id;
      });

      expect(tripIds).to.deep.equal([1]);
    });

    it('trips', function() {
      var trips;
      var client = new FlightSearchClient({
        onTripsChanged: function(_trips) {
          trips = _trips;
        }
      });

      mockAjaxCall(client);

      var fare1 = {
        id: 1,
        tripId: 1,
        price:  {
          amountUsd: 100,
        },
      };

      var trip1 = { id: 1 };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
        },
      };

      var trip2 = { id: 2 };

      client.sort = {
        by: 'PRICE',
        order: 'ASC'
      };

      client.handleSearchResponse({
        fares: [fare1, fare2],
        trips: [trip1, trip2],
      });

      var tripIds = trips.map(function(trip) {
        return trip.id;
      });

      expect(tripIds).to.deep.equal([2, 1]);
    });

    it('cheapestTrip', function() {
      var cheapestTrip;
      var client = new FlightSearchClient({
        onCheapestTripChanged: function(trip) {
          cheapestTrip = trip;
        }
      });

      mockAjaxCall(client);

      var trip1 = { id: 1 };

      var fare1 = {
        id: 1,
        tripId: 1,
        price:  {
          amountUsd: 100,
        },
      };

      var trip2 = { id: 2 };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
        },
      };

      client.handleSearchResponse({
        fares: [fare1, fare2],
        trips: [trip1, trip2],
      });

      expect(cheapestTrip.id).to.equal(2);
    });

    it('fastestTrip', function() {
      var fastestTrip;
      var client = new FlightSearchClient({
        onFastestTripChanged: function(trip) {
          fastestTrip = trip;
        }
      });

      mockAjaxCall(client);

      var trip1 = {
        id: 1,
        durationMinutes: 3,
      };

      var fare1 = {
        id: 1,
        tripId: 1,
        price:  {
          amountUsd: 100,
        },
      };

      var trip2 = {
        id: 2,
        durationMinutes: 5,
      };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
        },
      };

      client.handleSearchResponse({
        fares: [fare1, fare2],
        trips: [trip1, trip2],
      });

      expect(fastestTrip.id).to.equal(1);
    });

    it('bestExperienceTrip', function() {
      var bestExperienceTrip;
      client = new FlightSearchClient({
        onBestExperienceTripChanged: function(trip) {
          bestExperienceTrip = trip;
        }
      });

      mockAjaxCall(client);

      var trip1 = {
        id: 1,
        score: 3,
      };

      var fare1 = {
        id: 1,
        tripId: 1,
        price:  {
          amountUsd: 100,
        },
      };

      var trip2 = {
        id: 2,
        score: 5,
      };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
        },
      };

      client.handleSearchResponse({
        fares: [fare1, fare2],
        trips: [trip1, trip2],
      });

      expect(bestExperienceTrip.id).to.equal(2);
    });

    it('onCreatedTrip', function() {
      var onSearchCreated = sinon.spy();
      client = new FlightSearchClient({
        onSearchCreated: onSearchCreated
      });

      var search = { id: 1 };

      client.__fetchCount = 1;
      client.handleSearchResponse({
        search: search,
      });

      expect(onSearchCreated).to.have.been.calledWith(search);
    });
  });
});