var dataUtils = require('../../src/flight-search/dataUtils');

describe('data-utils', function() {
  describe('#prepareTrip', function() {
    describe('stopCode', function() {
      it('DIRECT when all leg stopsCount maximum is 0', function() {
        var trip = {
          legs: [
            createLeg({
              stopoversCount: 0,
            }),
            createLeg({
              stopoversCount: 0,
            })
          ]
        };

        dataUtils.prepareTrip(trip, createStaticData());

        expect(trip.stopCode).to.equal('DIRECT');
      });

      it('ONE_STOP when leg stopoversCount maximum is 1', function() {
        var trip = {
          legs: [
            createLeg({
              stopoversCount: 0,
            }),
            createLeg({
              stopoversCount: 1,
            })
          ]
        };

        dataUtils.prepareTrip(trip, createStaticData());

        expect(trip.stopCode).to.equal('ONE_STOP');
      });

      it('MORE_THAN_ONE_STOP when leg stopoversCount maximum is 2', function() {
        var trip = {
          legs: [
            createLeg({
              stopoversCount: 1,
            }),
            createLeg({
              stopoversCount: 2,
            })
          ]
        };

        dataUtils.prepareTrip(trip, createStaticData());

        expect(trip.stopCode).to.equal('MORE_THAN_ONE_STOP');
      });
    });

    it('airlineCodes', function() {
      var trip = {
        legs: [
          createLeg({
            airlineCodes: ['x', 'y', 'z']
          }),
          createLeg({
            airlineCodes: ['z', 't']
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.airlineCodes).to.deep.equal(['x', 'y', 'z', 't']);
    });

    it('destinationAirportCodes', function() {
      var trip = {
        legs: [
          createLeg({
            arrivalAirportCode: 'x'
          }),
          createLeg({
            departureAirportCode: 'y'
          }),
          createLeg({
            departureAirportCode: 'y'
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.destinationAirportCodes).to.deep.equal(['x', 'y']);
    });

    it('originAirportCodes', function() {
      var trip = {
        legs: [
          createLeg({
            departureAirportCode: 'x'
          }),
          createLeg({
            arrivalAirportCode: 'y'
          }),
          createLeg({
            arrivalAirportCode: 'y'
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.originAirportCodes).to.deep.equal(['x', 'y']);
    });

    it('allianceCodes', function() {
      var trip = {
        legs: [
          createLeg({
            allianceCodes: ['x', 'y', 'z']
          }),
          createLeg({
            allianceCodes: ['z', 't']
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.allianceCodes).to.deep.equal(['x', 'y', 'z', 't']);
    });

    it('departureAirportCode', function() {
      var airportCode = 'x';
      var trip = {
        legs: [
          createLeg({
            departureAirportCode: airportCode,
          }),
          createLeg({
            departureAirportCode: 'xxx',
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.departureAirportCode).to.equal(airportCode);
    });

    it('departureAirportCode', function() {
      var airportCode = 'x';
      var trip = {
        legs: [
          createLeg({
            arrivalAirportCode: airportCode,
          }),
          createLeg({
            arrivalAirportCode: 'xxx',
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.arrivalAirportCode).to.equal(airportCode);
    });

    it('stopoverAirportCodeMap', function() {
      var trip = {
        legs: [
          createLeg({
            stopoverAirportCodes: ['x', 'y'],
          }),
          createLeg({
            stopoverAirportCodes: ['y', 'z'],
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.stopoverAirportCodeMap).to.deep.equal({
        x: true,
        y: true,
        z: true,
      });
    });

    it('changeAtStopover is false when no airport change at stopover', function() {
      var trip = {
        legs: [
          createLeg({
            segments: [{
              departureAirportCode: "x",
              arrivalAirportCode: "y",
            },
            {
              departureAirportCode: "y",
              arrivalAirportCode: "x",
            }]
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.changeAirportAtStopover).to.equal(false);
    });

    it('changeAtStopover is true when airport change at stopover', function() {
      var trip = {
        legs: [
          createLeg({
            segments: [{
              departureAirportCode: "x",
              arrivalAirportCode: "y",
            },
            {
              departureAirportCode: "x",
              arrivalAirportCode: "y",
            }]
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.changeAirportAtStopover).to.equal(true);
    });

    it('stopoverDurationMinutes', function() {
      var trip = {
        legs: [
          createLeg({
            stopoverDurationMinutes: 4,
          }),
          createLeg({
            stopoverDurationMinutes: 6,
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.stopoverDurationMinutes).to.equal(6);
    });

    it('durationMinutes', function() {
      var trip = {
        legs: [
          createLeg({
            durationMinutes: 4,
          }),
          createLeg({
            durationMinutes: 6,
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.durationMinutes).to.equal(10);
    });

    it('departureTimeMinutes', function() {
      var trip = {
        legs: [
          createLeg({
            departureTimeMinutes: 4,
          }),
          createLeg({
            departureTimeMinutes: 6,
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.departureTimeMinutes).to.equal(4);
    });

    it('arrivalTimeMinutes', function() {
      var trip = {
        legs: [
          createLeg({
            arrivalTimeMinutes: 4,
          }),
          createLeg({
            arrivalTimeMinutes: 6,
          })
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.arrivalTimeMinutes).to.equal(6);
    });

    it('legIdMap', function() {
      var trip = {
        legs: [
          createLeg({
            id: 1,
          }),
          createLeg({
            id: 2,
          }),
        ]
      };

      dataUtils.prepareTrip(trip, createStaticData());

      expect(trip.legIdMap).to.deep.equal({
        1: true,
        2: true,
      });
    });

    describe('marketingAirlineCode', function() {
      it('when has same longestSegment airline code', function() {
        var marketingAirlineCode = 'MAC';
        var airline = {
          code: marketingAirlineCode,
        };
        var trip = {
          legs: [
            createLeg({
              longestSegment: {
                airline: airline,
              }
            }),
            createLeg({
              longestSegment: {
                airline: airline,
              }
            }),
          ]
        };

        dataUtils.prepareTrip(trip, createStaticData());

        expect(trip.marketingAirline).to.equal(airline);
      });

      it('when has different longestSegment airline code', function() {
        var airline1 = {
          code: 'x',
        };

        var airline2 = {
          code: 'y',
        };

        var trip = {
          legs: [
            createLeg({
              longestSegment: {
                airline: airline1,
              }
            }),
            createLeg({
              longestSegment: {
                airline: airline2,
              }
            }),
          ]
        };

        dataUtils.prepareTrip(trip, createStaticData());

        expect(trip.marketingAirline).to.equal(null);
      })
    });
  });

  describe('#prepareFare', function() {
    it('provider', function() {
      var provider = {
        code: 1,
      };

      var fare = {
        providerCode: 1,
      };

      dataUtils.prepareFare(fare, {}, createStaticData({
        providers: [provider]
      }));

      expect(fare.provider).to.equal(provider);
    });

    it('price', function() {
      var fare = {
        price: {
          currencyCode: 'VND',
          amountUsd: 10
        }
      };

      var currency = {
        currencyCode: 'VND',
      };

      dataUtils.prepareFare(fare, currency, createStaticData());

      expect(fare.price.currency).to.equal(currency);
    });

    it('paymentFees', function() {
      var fare = {
        paymentFees: [
          {
            amount: 1,
            amountUsd: '1',
            currencyCode: 'SGD'
          }
        ]
      }

      var currency = {
        code: 'VND',
        rate: 2
      };

      dataUtils.prepareFare(fare, currency, createStaticData());

      expect(fare.paymentFees[0].currencyCode).to.equal(currency.code);
      expect(fare.paymentFees[0].amount).to.equal(2);
    })
  });

  it('#prepareSegment', function() {
    var airline = {
      code: 1,
    };

    var operatingAirline = {
      code: 2,
    };

    var departureAirport = {
      code: 1,
    };

    var arrivalAirport = {
      code: 2,
    };

    var segment = {
      airlineCode: 1,
      operatingAirlineCode: 2,
      departureAirportCode: 1,
      arrivalAirportCode: 2,
    };

    dataUtils.prepareSegment(segment, createStaticData({
      airlines: [airline, operatingAirline],
      airports: [departureAirport, arrivalAirport],
    }));

    expect(segment.airline).to.equal(airline);
    expect(segment.operatingAirline).to.equal(operatingAirline);
    expect(segment.departureAirport).to.equal(departureAirport);
    expect(segment.arrivalAirport).to.equal(arrivalAirport);
  });

  describe('#prepareLeg', function() {
    it('departureAirport', function() {
      var departureAirport = {
        code: 1,
      };

      var leg = {
        departureAirportCode: 1,
      };

      dataUtils.prepareLeg(leg, createStaticData({
        airports: [departureAirport],
      }));

      expect(leg.departureAirport).to.equal(departureAirport);
    });

    it('arrivalAirport', function() {
      var arrivalAirport = {
        code: 1,
      };

      var leg = {
        arrivalAirportCode: 1,
      };

      dataUtils.prepareLeg(leg, createStaticData({
        airports: [arrivalAirport],
      }));

      expect(leg.arrivalAirport).to.equal(arrivalAirport);
    });

    it('segments', function() {
      var airline = {
        code: 1,
      };

      var leg = {
        segments: [
          {
            airlineCode: 1,
          }
        ],
      };

      dataUtils.prepareLeg(leg, createStaticData({
        airlines: [airline],
      }));

      expect(leg.segments[0].airline).to.equal(airline);
    });

    it('longestSegment', function() {
      var leg = {
        segments: [
          {
            id: 1,
            durationMinutes: 4
          },
          {
            id: 2,
            durationMinutes: 7
          },
          {
            id: 3,
            durationMinutes: 5
          }
        ]
      };

      dataUtils.prepareLeg(leg, createStaticData());
      expect(leg.longestSegment.id).to.equal(2);
    });

    it('airlines', function() {
      var airline1 = {
        code: 1,
      };

      var airline2 = {
        code: 2,
      };

      var airline3 = {
        code: 3,
      };

      var leg = {
        segments: [
          {
            id: 1,
            durationMinutes: 4,
            airlineCode: 1,
          },
          {
            id: 2,
            durationMinutes: 7,
            airlineCode: 2,
          },
          {
            id: 3,
            durationMinutes: 5,
            airlineCode: 3,
          },
          {
            id: 4,
            durationMinutes: 6,
            airlineCode: 2,
          },
        ]
      };

      dataUtils.prepareLeg(leg, createStaticData({
        airlines: [airline1, airline2, airline3]
      }));
      var airlineCodes = leg.airlines.map(function(airline) { return airline.code; });
      expect(airlineCodes).to.deep.equal([2, 3 ,1]);
    });
  });

  describe('#convertPrice', function() {
    it('#remaining amount and total amount when having same currency', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var amountUsd = 1;
      var totalAmount = 40;
      var totalAmountUsd = 2;
      var price = {
        currencyCode: currencyCode,
        amount: amount,
        totalAmount: totalAmount,
        amountUsd: amountUsd,
        totalAmountUsd: totalAmountUsd,
        paymentFeeAmountUsd: 2
      };

      var currency = {
        code: currencyCode,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(amount);
      expect(convertedPrice.totalAmount).to.equal(totalAmount);
      expect(convertedPrice.amountUsd).to.equal(amountUsd);
      expect(convertedPrice.totalAmountUsd).to.equal(totalAmountUsd);
    });

    it('#converting amountUsd, totalAmountUsd, originalAmountUsd to different currency when having different currency', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var originalAmount = 8;
      var totalAmount = 32;
      var price = {
        currencyCode: 'FC',
        amountUsd: 5.2,
        totalAmountUsd: 20.8,
        originalAmountUsd: 4
      };

      var currency = {
        code: currencyCode,
        rate: 2,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(originalAmount);
      expect(convertedPrice.totalAmount).to.equal(totalAmount);
      expect(convertedPrice.originalAmount).to.equal(originalAmount);
    });

    it('#converting amountUsd, totalAmountUsd, originalAmountUsd to different currency when having different currency with paymentFee', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var originalAmount = 8;
      var totalAmount = 40;
      var price = {
        currencyCode: 'FC',
        amountUsd: 5.2,
        totalAmountUsd: 20.8,
        originalAmountUsd: 4,
        paymentFeeAmountUsd: 2
      };

      var currency = {
        code: currencyCode,
        rate: 2,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(12);
      expect(convertedPrice.totalAmount).to.equal(48);
      expect(convertedPrice.originalAmount).to.equal(originalAmount);
    });

    it('#converting amountUsd, totalAmountUsd, originalAmountUsd to different currency when having different currency with rounding off', function() {
      var currencyCode = 'CC';
      var amount = 5;
      var originalAmount = 8;
      var totalAmount = 35;
      var price = {
        currencyCode: 'FC',
        amountUsd: 2.7,
        totalAmountUsd: 20,
        originalAmountUsd: 3.75,
        paymentFeeAmountUsd: 2
      };

      var currency = {
        code: currencyCode,
        rate: 2,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(12);
      expect(convertedPrice.totalAmount).to.equal(84);
      expect(convertedPrice.originalAmount).to.equal(originalAmount);
    });

    it('#convertPaymentFee should not convert if currency is the same', function() {
      var paymentFee = {
        currencyCode: 'USD',
        amount: 1.4,
        amountUsd: 1.0
      }

      var currency = {
        code: 'USD'
      }

      var convertedPaymentFee = dataUtils.convertPaymentFee(paymentFee, currency);

      expect(convertedPaymentFee.amount).to.equal(1.4);
    });

    it('converPaymentFee should convert to different exchange rate', function() {
      var paymentFee = {
        currencyCode: 'SGD',
        amount: 1.4,
        amountUsd: 1.0
      }

      var currency = {
        code: 'USD',
        rate: 3
      }

      var convertedPaymentFee = dataUtils.convertPaymentFee(paymentFee, currency);

      expect(convertedPaymentFee.amount).to.equal(3);
    });

    it('converPaymentFee should convert to different exchange rate', function() {
      var paymentFee = {
        currencyCode: 'SGD',
        amount: 1.4,
        amountUsd: 1.0
      }

      var currency = {
        code: 'USD',
        rate: 3
      }

      var convertedPaymentFee = dataUtils.convertPaymentFee(paymentFee, currency);

      expect(convertedPaymentFee.amount).to.equal(3);
      expect(convertedPaymentFee.currencyCode).to.equal('USD');
    });

    it('converPaymentFees should convert to different exchange rate', function() {
      var paymentFee = [
        {
          currencyCode: 'SGD',
          amount: 1.4,
          amountUsd: 1.0
        },
        {
          currencyCode: 'SGD',
          amount: 1.4,
          amountUsd: 2.0
        },
      ]

      var currency = {
        code: 'USD',
        rate: 3
      }

      var convertedPaymentFees = dataUtils.convertPaymentFees(paymentFee, currency);

      expect(convertedPaymentFees[0].amount).to.equal(3);
      expect(convertedPaymentFees[1].amount).to.equal(6);
    });

  });

  function createStaticData(data) {
    var staticData = {};
    data = data || {};
    ['airlines', 'airports', 'providers'].forEach(function (type) {
      var items = data[type] || [];
      staticData[type] = {};
      items.forEach(function(item) {
        staticData[type][item.code || item.id] = item;
      });
    });
    return staticData;
  }

  function createLeg(data) {
    return Object.assign({
      longestSegment: {
        airline: {}
      },
      segments: []
    }, data);
  }
});
