var FlightSearchMerger = require('../../src/flight-search/Merger');

describe('FlightSearchMerger', function() {
  var merger;
  beforeEach(function() {
    merger = new FlightSearchMerger();
    merger.reset();
  });

  describe('#updateCurrency', function() {
    it('update trip fare', function() {
      var trip = {
        id: 1,
      };

      var fare = {
        tripId: 1,
        price: {
          currencyCode: 'vnd',
          amountUsd: 10,
          originalAmountUsd: 10,
          totalAmountUsd: 10,
        },
        paymentFees: [
          {
            currencyCode: 'vnd',
            amount: 1.3,
            amountUsd: 1,
            originalAmountUsd: 1,
            totalAmountUsd: 1,
          }
        ]
      };

      var currency = {
        code: 'sgd',
        rate: 2,
      };

      merger.mergeResponse({
        trips: [trip],
        fares: [fare]
      });

      var oldTrips = merger.getTrips();
      var oldTrip = oldTrips[0];

      merger.updateCurrency(currency);

      var newTrips = merger.getTrips();
      var newTrip = newTrips[0];

      expect(newTrip.fares[0].price.amount).to.equal(20);
      expect(newTrips).to.not.equal(oldTrips);
      expect(newTrip).to.not.equal(oldTrip);
      expect(newTrip.fares[0].paymentFees[0].amount).to.equal(2);
    });

    it('update filter', function() {
      var currency = {
        code: 'sgd',
        rate: 2,
      };

      var filterOption = {
        price: {
          currencyCode: 'vnd',
          amountUsd: 10,
          originalAmountUsd: 10,
          totalAmountUsd: 10,
        }
      };

      merger.mergeResponse({
        filters: {
          airlines: [filterOption]
        }
      });

      var oldFilter = merger.getFilter();
      var oldAirlineOptions = oldFilter.airlines;
      var oldFilterOption = oldFilter.airlines[0];

      merger.updateCurrency(currency);

      var newFilter = merger.getFilter();
      var newFilterOption = newFilter.airlines[0];

      expect(newFilterOption.price.amount).to.equal(20);
      expect(newFilterOption).to.not.equal(oldFilterOption);
      expect(newFilter.airlines).to.not.equal(oldAirlineOptions);
      expect(newFilter).to.not.equal(oldFilter);
    });

    it('update minPrice', function() {
      merger.mergeResponse({
        filters: {
          minPrice: {
            currencyCode: 'vnd',
            amountUsd: 10,
            originalAmountUsd: 10,
            totalAmountUsd: 10,
          }
        }
      });

      var oldFilter = merger.getFilter();
      var oldMinPrice = oldFilter.minPrice;

      merger.updateCurrency({
        code: 'sgd',
        rate: 2,
      });

      var newFilter = merger.getFilter();
      var newMinPrice = newFilter.minPrice;

      expect(newMinPrice.amount).to.equal(20);
      expect(newFilter).to.not.equal(oldFilter);
      expect(newMinPrice).to.not.equal(oldMinPrice);
    });

    it('update maxPrice', function() {
      merger.mergeResponse({
        filters: {
          maxPrice: {
            currencyCode: 'vnd',
            amountUsd: 10,
            originalAmountUsd: 10,
            totalAmountUsd: 10,
          }
        }
      });

      var oldFilter = merger.getFilter();
      var oldMaxPrice = oldFilter.maxPrice;

      merger.updateCurrency({
        code: 'sgd',
        rate: 2,
      });

      var newFilter = merger.getFilter();
      var newMaxPrice = newFilter.maxPrice;

      expect(newMaxPrice.amount).to.equal(20);
      expect(newFilter).to.not.equal(oldFilter);
      expect(newMaxPrice).to.not.equal(oldMaxPrice);
    });
  });

  describe('mergeStaticData', function() {
    it('merging countries', function() {
      var city = {
        code: 1,
        name: 1,
        countryCode: 1,
      };

      var country = {
        code: 1,
        name: 1,
      };

      merger.mergeResponse({
        cities: [city],
        countries: [country]
      });

      expect(merger.__staticData.cities[1]).to.equal(city);
      expect(merger.__staticData.cities[1].country).to.equal(country);
    });

    it('merging airports', function() {
      var airport = {
        code: 1,
        name: 1,
        cityCode: 1,
      };

      var city = {
        code: 1,
        name: 1,
      };

      merger.mergeResponse({
        cities: [city],
        airports: [airport]
      });

      expect(merger.__staticData.airports[1]).to.equal(airport);
      expect(merger.__staticData.airports[1].city).to.equal(city);
    });

    it('merging airlines', function() {
      var airline = {
        code: 1,
        name: 1,
      };

      merger.mergeResponse({
        airlines: [airline]
      });

      expect(merger.__staticData.airlines[1]).to.equal(airline);
    });

    it('merging providers', function() {
      var provider = {
        code: 1,
        name: 1,
      };

      merger.mergeResponse({
        providers: [provider]
      });

      expect(merger.__staticData.providers[1]).to.equal(provider);
    });
  });

  describe('merge trips', function() {
    it('add legs', function() {
      var legId = 2;
      var leg = {
        id: legId,
      };

      merger.mergeResponse({
        legs: [leg]
      });

      expect(merger.__legMap[legId]).to.equal(leg);
    });

    it('add legConditionIds', function() {
      var legs = [
        {
          id: "id1",
          conditionIds: [1]
        },
        {
          id: "id2"
        }
      ];

      var newLegConditions = {
        id1: [2],
        id2: [3]
      };

      merger.mergeResponse({
       legs: legs,
       legConditionIds: newLegConditions 
      });

      expect(merger.__legMap["id1"]["conditionIds"]).to.deep.equal([2])
      expect(merger.__legMap["id2"]["conditionIds"]).to.deep.equal([3])
    });

    it('add trip', function() {
      var legId = 2;
      var leg = {
        id: legId,
        segments: [
          {
            airlineCode: 1,
          }
        ],
      };

      var tripId = 4;
      var trip = {
        id: tripId,
        legIds: [legId],
      };

      merger.mergeResponse({
        legs: [leg],
        trips: [trip],
      });

      expect(merger.__tripMap[tripId]).to.equal(trip);
      expect(merger.__tripMap[tripId].legs[0]).to.equal(leg);
    });

    it('processing trip', function() {
      var tripId = 4;
      var departureTimeMinutes = 1;
      var legId = 2;
      var leg = {
        id: legId,
        departureTimeMinutes: departureTimeMinutes,
        segments: [
          {
            airlineCode: 1,
          }
        ],
      };

      var trip = {
        id: tripId,
        legIds: [legId],
      };

      merger.mergeResponse({
        legs: [leg],
        trips: [trip],
      });

      expect(merger.__tripMap[tripId].departureTimeMinutes).to.equal(departureTimeMinutes);
    });
  });

  it('merge experience scores', function() {
    var tripId = 4;
    var score = 5;
    var trip = {
      id: tripId,
    };

    merger.mergeResponse({
      trips: [trip],
    });

    var oldTrip = merger.__tripMap[tripId];

    merger.mergeResponse({
      scores: {
        4: score,
      }
    });

    expect(merger.__tripMap[tripId].score).to.equal(score);
    expect(merger.__tripMap[tripId]).to.not.equal(oldTrip);
  });

  it('merge fares', function() {
    var tripId = 4;
    var providerCode = 'PC';
    var provider = {
      code: providerCode
    };

    var fare1 = {
      id: 1,
      tripId: tripId,
      providerCode: providerCode,
      price: {
        amountUsd: 10,
        originalAmountUsd: 10,
        totalAmountUsd: 10,
      }
    };

    var fare2 = {
      id: 2,
      tripId: tripId,
      providerCode: providerCode,
      price: {
        amountUsd: 5,
        originalAmountUsd: 5,
        totalAmountUsd: 5,
      }
    };

    var fare3 = {
      id: 3,
      tripId: tripId,
      providerCode: providerCode,
      price: {
        amountUsd: 7,
        originalAmountUsd: 7,
        totalAmountUsd: 7,
      }
    };

    var fare4 = {
      id: 3,
      tripId: tripId,
      providerCode: providerCode,
      price: {
        amountUsd: 7,
        originalAmountUsd: 7,
        totalAmountUsd: 7,
      }
    };

    var trip = {
      id: tripId,
    };

    merger.mergeResponse({
      providers: [provider],
      trips: [trip],
    });

    var oldTrip = merger.__tripMap[tripId];

    merger.mergeResponse({
      fares: [fare1, fare2, fare3, fare4]
    });

    var fares = merger.__tripMap[tripId].fares;

    var faresIds = fares.map(function(fare) {
      return fare.id;
    });

    expect(faresIds).to.deep.equal([2, 3, 1]);

    expect(merger.__tripMap[tripId]).to.not.equal(oldTrip);
  });

  describe('merge filter', function() {
    it('updating price for existing options', function() {
      var price = {
        amountUsd: 5,
        originalAmountUsd: 5,
        totalAmountUsd: 5,
        currencyCode: 'VND',
      };

      var newPrice = {
        amountUsd: 20,
        originalAmountUsd: 20,
        totalAmountUsd: 20,
        currencyCode: 'VND',
      };

      merger.currency = {
        code: 'SGD',
        rate: 0.5,
      };

      var option = {
        code: 1,
        price: price
      };

      var newOption = {
        code: 1,
        price: newPrice
      };

      merger.mergeResponse({
        filters: {
          airlines: [option]
        }
      });
      var oldFilter = merger.getFilter();

      var oldAirlines = oldFilter.airlines;
      var airlineFilterOption = oldFilter.airlines[0];

      merger.mergeResponse({
        filters: {
          airlines: [newOption]
        }
      });

      filter = merger.getFilter();
      expect(filter.airlines.length).to.equal(1);
      expect(filter.airlines[0].price.amount).to.equal(10);
      expect(filter.airlines[0]).to.not.equal(airlineFilterOption);
      expect(filter.airlines).to.not.equal(oldAirlines);
      expect(filter).to.not.equal(oldFilter);
    });

    it('inserting new option in alphabet sorted order', function() {
      var option1 = {
        code: 1,
        count: 5
      };

      var option2 = {
        code: 2,
        count: 7
      };

      var option3 = {
        code: 3,
        count: 7
      };

      merger.__staticData.airlines = {
        1: {
          name: 'ab'
        },
        2: {
          name: 'cd',
        },
        3: {
          name: 'ac',
        }
      };

      merger.mergeResponse({
        filters: {
          airlines: [option1, option2]
        }
      });

      merger.mergeResponse({
        filters: {
          airlines: [option3]
        }
      });

      var filter = merger.getFilter();
      expect(filter.airlines[1].code).to.equal(3);
    });

    it('airlines', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.airlines = {
        1: {
          code: 1,
          name: 'chain',
        }
      };

      merger.mergeResponse({
        filters: {
          airlines: [option]
        }
      });

      var filter = merger.getFilter();
      expect(filter.airlines[0].name).to.equal('chain');
    });

    it('airlines', function() {
      var option = {
        code: 1,
      };

      var airline = {
        code: 1,
        name: 'chain',
      };

      merger.mergeResponse({
        airlines: [airline],
        filters: {
          airlines: [option]
        }
      });

      var filter = merger.getFilter();
      var filterOption = filter.airlines[0];
      expect(filterOption.name).to.equal('chain');
      expect(filterOption.item).to.equal(airline);
    });

    it('stops', function() {
      var directOption = {
        code: 'DIRECT',
      };

      var oneStopOption = {
        code: 'ONE_STOP',
      };

      var moreThanOneStopOption = {
        code: 'MORE_THAN_ONE_STOP',
      };

      merger.mergeResponse({
        filters: {
          stops: [moreThanOneStopOption, directOption, oneStopOption],
        }
      });

      var filter = merger.getFilter();
      expect(filter.stops).to.deep.equal([directOption, oneStopOption, moreThanOneStopOption]);
    });

    it('alliances', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.alliances = {
        1: {
          code: 1,
          name: 'name',
        }
      };

      merger.mergeResponse({
        filters: {
          alliances: [option]
        }
      });

      var filter = merger.getFilter();
      expect(filter.alliances[0].name).to.equal('name');
    });

    it('originAirports', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.airports = {
        1: {
          code: 1,
          name: 'name',
        }
      };

      merger.mergeResponse({
        filters: {
          originAirports: [option]
        }
      });

      var filter = merger.getFilter();
      expect(filter.originAirports[0].name).to.equal('name');
    });

    it('destinationAirports', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.airports = {
        1: {
          code: 1,
          name: 'name',
        }
      };

      merger.mergeResponse({
        filters: {
          destinationAirports: [option]
        }
      });

      var filter = merger.getFilter();
      expect(filter.destinationAirports[0].name).to.equal('name');
    });

    it('stopoverAirports', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.airports = {
        1: {
          code: 1,
          name: 'name',
        }
      };

      merger.mergeResponse({
        filters: {
          stopoverAirports: [option]
        }
      });

      var filter = merger.getFilter();
      expect(filter.stopoverAirports[0].name).to.equal('name');
    });

    it('minPrice', function() {
      var price  = {
        currencyCode: 'sgd',
        amountUsd: 10,
        originalAmountUsd: 10,
        totalAmountUsd: 10,
      };

      merger.currency = {
        rate: 2,
        currencyCode: 'vnd',
      };

      merger.mergeResponse({
        filters: {
          minPrice: price,
        }
      });
      var filter = merger.getFilter();

      expect(filter.minPrice.amount).to.equal(20);
    });

    it('maxPrice', function() {
      var price  = {
        currencyCode: 'sgd',
        amountUsd: 10,
        originalAmountUsd: 10,
        totalAmountUsd: 10,
      };

      merger.currency = {
        rate: 2,
        currencyCode: 'vnd',
      };

      merger.mergeResponse({
        filters: {
          maxPrice: price,
        }
      });
      var filter = merger.getFilter();

      expect(filter.maxPrice.amount).to.equal(20);
    });

    describe('legs', function() {
      it('add departureCity, departureAirport, arrivalCity, arrivalAirport', function() {
        var departureCityCode = 'X1';
        var departureAirportCode = 'X2';
        var arrivalCityCode = 'X3';
        var arrivalAirportCode = 'X4';

        var departureCity = {
          code: departureCityCode,
        };

        var departureAirport = {
          code: departureAirportCode,
        };

        var arrivalCity = {
          code: arrivalCityCode,
        };

        var arrivalAirport = {
          code: arrivalAirportCode,
        };


        var leg = {
          departureCityCode: departureCityCode,
          departureAirportCode: departureAirportCode,
          arrivalCityCode: arrivalCityCode,
          arrivalAirportCode: arrivalAirportCode,
          index: 0,
        };

        merger.mergeResponse({
          cities: [departureCity, arrivalCity],
          airports: [departureAirport, arrivalAirport],
          filters: {
            legs: [leg],
          }
        });

        var filter = merger.getFilter();
        var filterLeg = filter.legs[0];
        expect(filterLeg.departureCity).to.equal(departureCity);
        expect(filterLeg.departureAirport).to.equal(departureAirport);
        expect(filterLeg.arrivalCity).to.equal(arrivalCity);
        expect(filterLeg.arrivalAirport).to.equal(arrivalAirport);
      });

      it('departureTimes', function() {
        var range = { min: 1, max: 2 };

        var leg1 = {
          index: 0,
        };

        var leg2 = {
          index: 0,
          departureTimes: range,
        };


        merger.mergeResponse({
          filters: {
            legs: [leg1],
          }
        });

        var oldFilter = merger.getFilter();
        var oldLegs = oldFilter.legs;
        var oldLeg = oldLegs[0];

        merger.mergeResponse({
          filters: {
            legs: [leg2],
          }
        });

        var filter = merger.getFilter();
        expect(filter.legs[0].departureTimes).to.equal(range);
        expect(filter.legs[0]).not.to.equal(oldLeg);
        expect(filter.legs).not.to.equal(oldLegs);
        expect(filter).not.to.equal(oldFilter);
      });

      it('durations', function() {
        var range = { min: 1, max: 2 };

        var leg1 = {
          index: 0,
        };

        var leg2 = {
          index: 0,
          durations: range,
        };

        merger.mergeResponse({
          filters: {
            legs: [leg1],
          }
        });

        merger.mergeResponse({
          filters: {
            legs: [leg2],
          }
        });

        var filter = merger.getFilter();

        expect(filter.legs[0].durations).to.equal(range);
      });
    });

    it('stopoverDurations', function() {
      var range  = { min: 1, max: 3 };
      merger.mergeResponse({
        filters: {
          stopoverDurations: range,
        }
      });
      var filter = merger.getFilter();
      expect(filter.stopoverDurations).to.equal(range);
    });
  });
});
