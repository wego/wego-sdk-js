module.exports = {
  prepareTrip: function(trip) {
    trip.fares = [];

    var legs = trip.legs;
    if (!legs || legs.length === 0) return;

    trip.legIdMap = {};

    legs.forEach(function(leg, index) {
      trip.legIdMap[index + leg.id] = true;
    });

    var firstLeg = legs[0];

    function setStopCodes(trip, legs) {
      var maxStopsCount = 0;
      var getStopCode = length => Math.min(length, 2);

      legs.forEach(function(leg) {
        var stopoversCount = leg.stopoversCount;
        maxStopsCount = Math.max(maxStopsCount, stopoversCount);
        leg.stopCode = getStopCode(stopoversCount);
      });

      trip.stopCode = getStopCode(maxStopsCount);
    }

    function hasOvernightLeg(legs) {
      var hasOvernight = false;
      legs.forEach(function(leg) {
        if (leg.overnight) hasOvernight = true;
      });
      return hasOvernight;
    }

    function hasLongStopoverLeg(legs) {
      var longStopover = false;
      legs.forEach(function(leg) {
        if (leg.longStopover) longStopover = true;
      });
      return longStopover;
    }

    function hasAirportChangeAtStopover(legs) {
      for (var i = legs.length; i--;) {
        var segments = legs[i].segments;
        for(var j=segments.length-1; j > 0; j--) {
          if(segments[j].departureAirportCode !== segments[j-1].arrivalAirportCode)
            return true;
        }
      }
      return false;
    }

    function getDurationMinutes(legs) {
      return legs.reduce(function(sum, value) {
        return sum + value.durationMinutes;
      }, 0);
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

    // Destination and origin will not work for multi city
    // as there is no concept of destination or origin
    function getDestinationAirportCodes(legs) {
      var codes = [legs[0].arrivalAirportCode];
      if (legs.length > 1) {
        for (var i = 1; i < legs.length; i ++) {
          var code = legs[i].departureAirportCode;
          if (!codes.includes(code)) {
            codes.push(legs[i].departureAirportCode);
          }
        }
      }
      return codes;
    }

    function getOriginAirportCodes(legs) {
      var codes = [legs[0].departureAirportCode];
      if (legs.length > 1) {
        for (var i = 1; i < legs.length; i ++) {
          var code = legs[i].arrivalAirportCode;
          if (!codes.includes(code)) {
            codes.push(legs[i].arrivalAirportCode);
          }
        }
      }
      return codes;
    }

    setStopCodes(trip, legs);

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

    trip.durationMinutes = getDurationMinutes(legs);

    trip.departureTimeMinutes = firstLeg.departureTimeMinutes;

    trip.arrivalTimeMinutes = legs[legs.length - 1].arrivalTimeMinutes;

    trip.marketingAirline = getMarketingAirline(legs);

    trip.overnight = hasOvernightLeg(legs);

    trip.longStopover = hasLongStopoverLeg(legs);

    trip.destinationAirportCodes = getDestinationAirportCodes(legs);

    trip.originAirportCodes = getOriginAirportCodes(legs)
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
    fare.paymentFees = this.convertPaymentFees(fare.paymentFees, currency);
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
    var originalAmount = price.originalAmount;
    var paymentFeeAmountUsd = 0;

    if (price.paymentFeeAmountUsd) {
      paymentFeeAmountUsd = price.paymentFeeAmountUsd;
    }

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      originalAmount = Math.round(price.originalAmountUsd * exchangeRate);
      amount = originalAmount + Math.round(paymentFeeAmountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
    }

    return {
      currency: currency,
      amount: amount,
      originalAmount: originalAmount,
      totalAmount: totalAmount,
      amountUsd: price.amountUsd,
      totalAmountUsd: price.totalAmountUsd,
      originalAmountUsd: price.originalAmountUsd,
      paymentFeeAmountUsd: paymentFeeAmountUsd
    };
  },

  convertPaymentFee: function(paymentFee, currency) {
    if (!currency) return paymentFee;
    if (!paymentFee) return null;

    var amount = paymentFee.amount;
    if (paymentFee.currencyCode !== currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(paymentFee.amountUsd * exchangeRate);
    }

    return {
      paymentMethodId: paymentFee.paymentMethodId,
      currencyCode: currency.code,
      amount: amount,
      amountUsd: paymentFee.amountUsd
    };
  },

  convertPaymentFees: function(paymentFees, currency) {
    if (!paymentFees) return null;

    var self = this;
    return paymentFees.map(function(paymentFee) {
      return self.convertPaymentFee(paymentFee, currency)
    });
  },

  __filterOptionTypeToStaticDataType: {
    airlines: 'airlines',
    stops: 'stops',
    alliances: 'alliances',
    originAirports: 'airports',
    destinationAirports: 'airports',
    stopoverAirports: 'airports',
    providers: 'providers',
    fareConditions: 'fareConditions',
    legConditions: 'legConditions'
  }
};
