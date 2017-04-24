module.exports = {
  prepareTrip: function(trip) {
    trip.fares = [];

    var legs = trip.legs;
    if (!legs || legs.length === 0) return;

    trip.legIdMap = {};

    legs.forEach(function(leg) {
      trip.legIdMap[leg.id] = true;
    });

    var firstLeg = legs[0];

    function getStopCode(legs) {
      var maxStopsCount = 0;
      legs.forEach(function(leg) {
        maxStopsCount = Math.max(maxStopsCount, leg.stopoversCount);
      });

      switch (maxStopsCount) {
        case 0:
          return 'DIRECT';
        case 1:
          return 'ONE_STOP';
        default:
          return 'MORE_THAN_ONE_STOP';
      }
    }

    function hasOvernightLeg(legs) {
      var hasOvernight = false;
      legs.forEach(function(leg) {
        if (leg.overnight) hasOvernight = true;
      });
      return hasOvernight;
    }

    function hasAirportChangeAtStopover(legs) {
      for (var i = 0; i < legs.length - 1; i++) {
        if (legs[i].arrivalAirportCode !== legs[i + 1].departureAirportCode) return true;
      }
      return false;
    }

    function getMarketingAirline(legs) {
      var marketingAirline = null;
      for (var i = 0; i < legs.length; i++) {
        var airline = legs[i].longestSegment.airline;
        if (marketingAirline === null) {
          marketingAirline = airline;
        } else if (marketingAirline.code != airline.code) {
          return null;
        }
      }
      return marketingAirline;
    }

    function concatListsToMap(lists) {
      var map = {};
      lists.forEach(function(list) {
        list = list || [];
        list.forEach(function(item) {
          map[item] = true;
        });
      });
      return map;
    }

    function concatListsToList(lists) {
      return Object.keys(concatListsToMap(lists));
    }

    function max(numbers) {
      var ans = 0;
      numbers.forEach(function(number) {
        ans = Math.max(ans, number);
      });
      return ans;
    }

    trip.stopCode = getStopCode(legs);

    trip.airlineCodes = concatListsToList(legs.map(function(leg){
      return leg.airlineCodes;
    }));

    trip.allianceCodes = concatListsToList(legs.map(function(leg){
      return leg.allianceCodes;
    }));

    trip.departureAirportCode = firstLeg.departureAirportCode;

    trip.arrivalAirportCode = firstLeg.arrivalAirportCode;

    trip.stopoverAirportCodeMap = concatListsToMap(legs.map(function(leg) {
      return leg.stopoverAirportCodes;
    }));

    trip.changeAirportAtStopover = hasAirportChangeAtStopover(legs);

    trip.stopoverDurationMinutes = max(legs.map(function(leg) {
      return leg.stopoverDurationMinutes;
    }));

    trip.durationMinutes = max(legs.map(function(leg) {
      return leg.durationMinutes;
    }));

    trip.departureTimeMinutes = firstLeg.departureTimeMinutes;

    trip.arrivalTimeMinutes = legs[legs.length - 1].arrivalTimeMinutes;

    trip.marketingAirline = getMarketingAirline(legs);

    trip.overnight = hasOvernightLeg(legs);
  },

  prepareLeg: function(leg, staticData) {
    var self = this;
    var airports = staticData.airports;
    leg.departureAirport = airports[leg.departureAirportCode];
    leg.arrivalAirport = airports[leg.arrivalAirportCode];

    var segments = leg.segments || [];

    segments.forEach(function(segment) {
      self.prepareSegment(segment, staticData);
    });

    var sortedSegments = segments.map(function(segment) {
      return segment;
    }).sort(function(s1, s2) {
      return s2.durationMinutes - s1.durationMinutes;
    });

    leg.longestSegment = sortedSegments[0];

    var airlines = sortedSegments.map(function(segment) {
      return segment.airline;
    });

    function uniq(items) {
      return items.filter(function(item, pos, self) {
        return self.indexOf(item) == pos;
      })
    }

    leg.airlines = uniq(airlines);
  },

  prepareSegment: function(segment, staticData) {
    var airlines = staticData.airlines;
    var airports = staticData.airports;
    segment.airline = airlines[segment.airlineCode];
    segment.operatingAirline = airlines[segment.operatingAirlineCode];
    segment.departureAirport = airports[segment.departureAirportCode];
    segment.arrivalAirport = airports[segment.arrivalAirportCode];
  },

  prepareFare: function(fare, currency, staticData) {
    fare.provider = staticData.providers[fare.providerCode];
    fare.price = this.convertPrice(fare.price, currency);
  },

  prepareFilterOption: function(option, type, currency, staticData) {
    var staticDataType = this.__filterOptionTypeToStaticDataType[type];
    var itemMap = staticData[staticDataType] || {};
    var item = itemMap[option.code] || {};
    option.name = item.name;
    option.item = item;
    option.price = this.convertPrice(option.price, currency);
  },

  prepareLegFilter: function(leg, staticData) {
    leg.departureCity = staticData.cities[leg.departureCityCode];
    leg.departureAirport = staticData.airports[leg.departureAirportCode];
    leg.arrivalCity = staticData.cities[leg.arrivalCityCode];
    leg.arrivalAirport = staticData.airports[leg.arrivalAirportCode];
  },

  convertPrice: function(price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount;
    var totalAmount = price.totalAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = price.amountUsd * exchangeRate;
      totalAmount = price.totalAmountUsd * exchangeRate;
    }

    return {
      currency: currency,
      amount: amount,
      totalAmount: totalAmount,
      amountUsd: price.amountUsd,
      totalAmountUsd: price.totalAmountUsd,
    };
  },

  __filterOptionTypeToStaticDataType: {
    airlines: 'airlines',
    stops: 'stops',
    alliances: 'alliances',
    originAirports: 'airports',
    destinationAirports: 'airports',
    stopoverAirports: 'airports',
  }
};
