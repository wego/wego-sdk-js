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
    it('resets poller', function() {
      client.poller.pollCount = 4;
      client.reset();
      expect(client.poller.pollCount).to.equal(0);
    });

    it('#reset merger', function() {
      client.handleSearchResponse({
        airports: [
          { id: 1 }
        ]
      });

      client.reset();

      expect(client.merger.__staticData.airports).to.deep.equal({});
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
      client.mergeResponse({});

      client.poller.timer = null;
      client.poller.pollCount = 2;

      client.updatePaymentMethodIds([]);

      expect(client.poller.pollCount).to.equal(0);
      expect(client.poller.timer).to.not.equal(null);
    });
  });

  describe('providerTypes change', function() {
    it('should reset and do new polling', function() {
      client.mergeResponse({
      });

      client.poller.timer = null;
      client.poller.pollCount = 2;

      client.updateProviderTypes([]);

      expect(client.poller.pollCount).to.equal(0);
      expect(client.poller.timer).to.not.equal(null);
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
            originalAmountUsd: 100,
            totalAmountUsd: 100,
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
              originalAmountUsd: 50,
              totalAmountUsd: 50,
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
    it('start poller', function() {
      client.poller.timer = null;
      client.searchTrips({});
      expect(client.poller.timer).not.equal(null);
    })
  });

  describe('handleSearchResponse', function() {
    it('update processedFaresCount', function() {
      var processedFaresCount = 10;

      client.handleSearchResponse({
        count: processedFaresCount,
      });

      expect(client.processedFaresCount).to.equal(processedFaresCount);
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

  describe('#getSearchRequestBody', function() {
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

      client.processedFaresCount = processedFaresCount;

      client.responseSearch = {
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

      var requestBody = client.getSearchRequestBody();

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

      expect(client.responseSearch).to.equal(search);
    });

    it('processedFaresCount', function() {
      var processedFaresCount = 15;
      client.handleSearchResponse({
        count: processedFaresCount,
      });
      expect(client.processedFaresCount).to.equal(processedFaresCount);
    });

    it('merge response by merger', function() {
      var airport = {
        id: 1
      };

      client.handleSearchResponse({
        airports: [airport]
      });

      expect(client.merger.__staticData.airports[1]).to.equal(airport);
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
          originalAmountUsd: 100,
          totalAmountUsd: 100,
        },
      };

      var trip1 = { id: 1 };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
          originalAmountUsd: 70,
          totalAmountUsd: 70,
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
          originalAmountUsd: 100,
          totalAmountUsd: 100,
        },
      };

      var trip2 = { id: 2 };

      var fare2 = {
        id: 2,
        tripId: 2,
        price:  {
          amountUsd: 70,
          originalAmountUsd: 70,
          totalAmountUsd: 70,
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
          originalAmountUsd: 100,
          totalAmountUsd: 100,
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
          originalAmountUsd: 70,
          totalAmountUsd: 70,
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
          originalAmountUsd: 100,
          totalAmountUsd: 100,
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
          originalAmountUsd: 70,
          totalAmountUsd: 70,
        },
      };

      client.handleSearchResponse({
        fares: [fare1, fare2],
        trips: [trip1, trip2],
      });

      expect(bestExperienceTrip.id).to.equal(2);
    });

    it('calls onProgressChanged', () => {
      var onProgressChanged = sinon.spy();
      client = new FlightSearchClient({
        onProgressChanged: onProgressChanged
      });
      client.poller.fetchCount = 10;
      client.handleSearchResponse({});
      expect(onProgressChanged).to.have.been.calledOnce();
    });

    it('onCreatedTrip', function() {
      var onSearchCreated = sinon.spy();
      client = new FlightSearchClient({
        onSearchCreated: onSearchCreated
      });

      var search = { id: 1 };

      client.poller.pollCount = 1;
      client.handleSearchResponse({
        search: search,
      });

      expect(onSearchCreated).to.have.been.calledWith(search);
    });
  });
});
