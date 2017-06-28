var filtering = require('../../src/flight-search/filtering');

describe('filtering', function() {
  describe('#filterTrips', function() {
    it('filtering by stopCodes', function() {
      var trip1 = {
        stopCode: 'DIRECT'
      };

      var trip2 = {
        stopCode: 'ONE_STOP',
      };

      var trip3 = {
        stopCode: 'DIRECT',
      };

      var filter = {
        stopCodes: ['DIRECT'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip3]);
    });

    it('filtering by leg departureMinutes', function() {
      var trip1 = {
        legs: [
          {
            departureTimeMinutes: 1,
          }
        ]
      };

      var trip2 = {
        legs: [
          {
            departureTimeMinutes: 4,
          }
        ]
      };

      var trip3 = {
        legs: [
          {
            departureTimeMinutes: 6,
          }
        ]
      };

      var filter = {
        departureTimeMinutesRanges: [
          {
            legIndex: 0,
            min: 4,
            max: 7,
          }
        ],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2, trip3]);
    });

    it('filtering by leg arrivalTimeMinutes', function() {
      var trip1 = {
        legs: [
          {
            arrivalTimeMinutes: 1,
          }
        ]
      };

      var trip2 = {
        legs: [
          {
            arrivalTimeMinutes: 4,
          }
        ]
      };

      var trip3 = {
        legs: [
          {
            arrivalTimeMinutes: 6,
          }
        ]
      };

      var filter = {
        arrivalTimeMinutesRanges: [
          {
            legIndex: 0,
            min: 4,
            max: 7,
          }
        ],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2, trip3]);
    });

    it('filtering by airlineCodes', function() {
      var trip1 = {
        marketingAirline: {
          code: 'A1',
        }
      };

      var trip2 = {
        marketingAirline: {
          code: 'A2',
        },
      };

      var trip3 = {
        marketingAirline: {
          code: 'A3',
        },
      };

      var trip4 = {};

      var filter = {
        airlineCodes: ['A1', 'A3'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3, trip4], filter)).to.deep.equal([trip1, trip3]);
    });

    it('filtering by allianceCodes', function() {
      var trip1 = {
        allianceCodes: ['A1', 'A3'],
      };

      var trip2 = {
        allianceCodes: ['A1', 'A4'],
      };

      var trip3 = {
        allianceCodes: ['A1', 'A5']
      };

      var filter = {
        allianceCodes: ['A1', 'A4', 'A5'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2, trip3]);
    });

    describe('filtering by tripOptions', function() {
      it('SAME_AIRLINE', function() {
        var trip1 = {
          airlineCodes: ['x'],
        };

        var trip2 = {
          airlineCodes: ['y'],
        };

        var trip3 = {
          airlineCodes: ['x', 'y'],
        };

        var filter = {
          tripOptions: ['SAME_AIRLINE'],
        };

        expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip2]);
      });
    });

    it('filtering by originAirportCodes', function() {
      var trip1 = {
        originAirportCodes: ['A3'],
      };

      var trip2 = {
        originAirportCodes: ['A1'],
      };

      var trip3 = {
        originAirportCodes: ['A5'],
      };

      var filter = {
        originAirportCodes: ['A3', 'A5'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip3]);
    });

    it('filtering by destinationAirportCodes', function() {
      var trip1 = {
        destinationAirportCodes: ['A3', 'A1'],
      };

      var trip2 = {
        destinationAirportCodes: ['A1'],
      };

      var trip3 = {
        destinationAirportCodes: ['A5'],
      };

      var filter = {
        destinationAirportCodes: ['A3', 'A5'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip3]);
    });

    it('filtering by stopoverAirportCodes', function() {
      var trip1 = {
        stopoverAirportCodeMap: {
          A1: true,
          A5: true,
        }
      };

      var trip2 = {
        stopoverAirportCodeMap: {
          A2: true,
          A6: true,
        }
      };

      var trip3 = {
        stopoverAirportCodeMap: {
          A3: true,
          A7: true,
        }
      };

      var filter = {
        stopoverAirportCodes: ['A1', 'A2'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip2]);
    });

    it('filtering by stopoverAirportCodes when stopoverAirportCodes is empty', function() {
      var trip = {
        stopoverAirportCodeMap: {
          A1: true,
          A5: true,
        }
      };

      var filter = {
        stopoverAirportCodes: [],
      };

      expect(filtering.filterTrips([trip], filter)).to.deep.equal([trip]);
    });

    describe('filtering by stopoverOptions', function() {
      it('NOT_CHANGE_AIRPORT', function() {
        var trip1 = {
          changeAirportAtStopover: false,
        };

        var trip2 = {
          changeAirportAtStopover: false,
        };

        var trip3 = {
          changeAirportAtStopover: true,
        };

        var filter = {
          stopoverOptions: ['NOT_CHANGE_AIRPORT']
        };

        expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip2]);
      });
    });

    it('filtering by outboundDurationMinutesRange', function() {
      var trip1 = {
        legs: [
          {
            durationMinutes: 4,
          }
        ]
      };

      var trip2 = {
        legs: [
          {
            durationMinutes: 6,
          }
        ]
      };

      var trip3 = {
        legs: [
          {
            durationMinutes: 10,
          }
        ]
      };

      var filter = {
        durationMinutesRanges: [
          {
            legIndex: 0,
            min: 5,
            max: 11,
          }
        ]
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2, trip3]);
    });

    it('filtering by stopoverDurationMinutesRange', function() {
      var trip1 = {
        stopoverDurationMinutes: 20,
      };

      var trip2 = {
        stopoverDurationMinutes: 6,
      };

      var trip3 = {
        stopoverDurationMinutes: 10,
      };

      var filter = {
        stopoverDurationMinutesRange: {
          min: 7,
          max: 22,
        }
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip3]);
    });

    it('filtering by legIds', function() {
      var trip1 = {
        legIdMap: {
          2: true,
          3: true,
        }
      };

      var trip2 = {
        legIdMap: {
          1: true,
          4: true,
        }
      };

      var trip3 = {
        legIdMap: {
          1: true,
          5: true,
        }
      };

      var filter = {
        legIds: [1],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2, trip3]);
    });
  });

  describe('filtering by itineraryOptions', function() {
    it('NOT_OVERNIGHT', function() {
      var trip1 = {
        overnight: false,
      };

      var trip2 = {
        overnight: false,
      };

      var trip3 = {
        overnight: true,
      };

      var filter = {
        itineraryOptions: ['NOT_OVERNIGHT'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip2]);
    });

    it('longStopover', function() {
      var trip1 = {
        longStopover: false,
      };

      var trip2 = {
        longStopover: false,
      };

      var trip3 = {
        longStopover: true,
      };

      var filter = {
        itineraryOptions: ['SHORT_STOPOVER'],
      };

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip2]);
    });

    it('filter by priceRange', function() {
      var filter = {
        priceRange: {
          min: 5,
          max: 8,
        }
      };

      var fare1 = createFareWithAmountUsd(4);
      var fare2 = createFareWithAmountUsd(5);
      var fare3 = createFareWithAmountUsd(6);
      var fare4 = createFareWithAmountUsd(10);
      var fare5 = createFareWithAmountUsd(11);

      var trip1 = {
        fares: [fare1, fare3]
      };

      var trip2 = {
        fares: [fare2, fare4]
      };

      var trip3 = {
        fares: [fare5]
      };
      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip2]);
    });
  });

  describe('filtering by providerTypes', function() {
    it('filter for instant book', function() {
      var filter = {
        providerTypes: ['instant']
      };

      var fare1 = createFareWithProvider('ota', 'wego.com-kiwi');
      var fare2 = createFareWithProvider('ota');
      var fare3 = createFareWithProvider('airline');

      var trip1 = {
        fares: [fare1, fare2]
      };

      var trip2 = {
        fares: [fare2, fare3]
      }

      expect(filtering.filterTrips([trip1, trip2], filter)).to.deep.equal([trip1]);
    });

    it('filter for airline', function() {
      var filter = {
        providerTypes: ['airline']
      };

      var fare1 = createFareWithProvider('ota', 'wego.com-kiwi');
      var fare2 = createFareWithProvider('airline');

      var trip1 = {
        fares: [fare1]
      };

      var trip2 = {
        fares: [fare2]
      }

      expect(filtering.filterTrips([trip1, trip2], filter)).to.deep.equal([trip2]);
    });

    it('filter for both airline and instant book', function() {
      var filter = {
        providerTypes: ['airline', 'instant']
      };

      var fare1 = createFareWithProvider('ota', 'wego.com-kiwi');
      var fare2 = createFareWithProvider('ota');
      var fare3 = createFareWithProvider('airline');

      var trip1 = {
        fares: [fare1]
      };

      var trip2 = {
        fares: [fare2]
      }

      var trip3 = {
        fares: [fare3]
      }

      expect(filtering.filterTrips([trip1, trip2, trip3], filter)).to.deep.equal([trip1, trip3]);
    });
  });

  function createFareWithAmountUsd(amountUsd) {
    return {
      price: {
        amountUsd: amountUsd,
      }
    };
  }

  function createFareWithProvider(providerType, providerCode) {
    var isInstant = (providerCode && providerCode.includes('wego.com')) ? true : false;
    return {
      provider: {
        type: providerType,
        code: providerCode || 'some-provider.com',
        instant: isInstant
      }
    }
  }

});