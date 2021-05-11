var utils = require('../utils');

module.exports = {
  sortTrips: function (trips, sort, filter = {}) {
    if (!sort) return trips;

    const { providerTypes, providerCodes, flexibilities } = filter;

    function getBestFare(trip) {
      if (!trip.fares[0]) return null;
      return trip.fares[0].price.amountUsd;
    }

    function getDuration(trip) {
      return trip.durationMinutes;
    }

    function getDepartureTime(legIndex) {
      return function (trip) {
        var leg = trip.legs[legIndex];
        return leg && leg.departureTimeMinutes;
      }
    }

    function getArrivalTime(legIndex) {
      return function (trip) {
        var leg = trip.legs[legIndex];
        return leg && (leg.arrivalTimeMinutes + leg.durationDays * 24 * 60);
      }
    }

    function getScore(trip) {
      return trip.score;
    }

    var getterMap = {
      PRICE: getBestFare,
      DURATION: getDuration,
      SCORE: getScore,
    };

    // changed OUTBOUND_DEPARTURE_TIME to LEG1_DEPARTURE_TIME
    //  and INBOUND_DEPARTURE_TIME to LEG2_DEPARTURE_TIME
    // Max 6 legs for now
    for (var i = 0; i < 6; i++) {
      getterMap['LEG' + (i + 1) + '_DEPARTURE_TIME'] = getDepartureTime(i);
      getterMap['LEG' + (i + 1) + '_ARRIVAL_TIME'] = getArrivalTime(i);
    }

    var propertyGetter = getterMap[sort.by] || function () { };
    var clonedTrips = utils.cloneArray(trips);

    const hasProviderTypesFilter = !!providerTypes && providerTypes.length > 0;
    const hasProviderCodesFilter = !!providerCodes && providerCodes.length > 0;
    const hasFlexibilitiesFilter = !!flexibilities && flexibilities.length > 0;

    if (hasProviderTypesFilter || hasProviderCodesFilter || hasFlexibilitiesFilter) {
      clonedTrips.forEach(clonedTrip => {
        const sortedFaresByFilter = [];
        const sortedFaresByDefault = [];

        for (const fare of clonedTrip.fares) {
          let matchesProviderTypesFilter = true;
          let matchesProviderCodesFilter = true;
          let matchesFlexibilitiesFilter = true;

          if (hasProviderTypesFilter) {
            const isWegoFare = providerTypes.includes('instant');
            const isAirlineFare = providerTypes.includes('airline');

            if (isWegoFare && isAirlineFare) {
              matchesProviderTypesFilter = fare.provider.wegoFare || fare.provider.instant || fare.provider.type === 'airline';
            } else if (isWegoFare) {
              matchesProviderTypesFilter = fare.provider.wegoFare || fare.provider.instant;
            } else if (isAirlineFare) {
              matchesProviderTypesFilter = fare.provider.type === 'airline';
            }
          }

          if (hasProviderCodesFilter) {
            const providerCode = fare.providerCode || fare.provider.code;
            matchesProviderCodesFilter = providerCodes.includes(providerCode);
          }

          if (hasFlexibilitiesFilter) {
            if (flexibilities.includes('refundable')) {
              matchesFlexibilitiesFilter = fare.refundable;
            }
          }

          if (matchesProviderTypesFilter && matchesProviderCodesFilter && matchesFlexibilitiesFilter) {
            sortedFaresByFilter.push(fare);
          } else {
            sortedFaresByDefault.push(fare);
          }
        }

        clonedTrip.fares = sortedFaresByFilter.concat(sortedFaresByDefault);
      })
    }

    clonedTrips.sort(function (trip1, trip2) {
      var compareResult = utils.compare(trip1, trip2, propertyGetter, sort.order);
      if (compareResult == 0 && sort.by != 'PRICE') {
        return utils.compare(trip1, trip2, getBestFare, 'ASC');
      } else {
        return compareResult;
      }
    });

    return clonedTrips;
  },

  getCheapestTrip: function (trips, filter) {
    const hasFlexibilitiesFilter = !!filter && !!filter.flexibilities && filter.flexibilities.length > 0;

    return this._getBestTripBy(trips, function (betterTrip, trip) {
      if (hasFlexibilitiesFilter) {
        if (filter.flexibilities.includes('refundable')) {
          const betterTripRefundableFare = betterTrip.fares.find(fare => fare.refundable);
          const tripRefundableFare = trip.fares.find(fare => fare.refundable);

          return betterTripRefundableFare.price.amountUsd < tripRefundableFare.price.amountUsd;

          // if ((!betterTripRefundableFare && !tripRefundableFare) || (!betterTripRefundableFare && !!tripRefundableFare)) {
          //   return false;
          // } else if (!!betterTripRefundableFare && !tripRefundableFare) {
          //   return true;
          // } else {
          //   return betterTripRefundableFare.price.amountUsd < tripRefundableFare.price.amountUsd;
          // }
        }
      } else {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
    });
  },

  getFastestTrip: function (trips) {
    return this._getBestTripBy(trips, function (betterTrip, trip) {
      if (betterTrip.durationMinutes === trip.durationMinutes) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.durationMinutes < trip.durationMinutes;
    });
  },

  getBestExperienceTrip: function (trips) {
    return this._getBestTripBy(trips, function (betterTrip, trip) {
      if (betterTrip.score === trip.score) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.score > trip.score;
    });
  },

  _getBestTripBy: function (trips, isBetterFunc) {
    var bestTrip = trips[0];
    for (var i = 1; i < trips.length; i++) {
      if (isBetterFunc(trips[i], bestTrip)) {
        bestTrip = trips[i];
      }
    }
    return bestTrip;
  }
};