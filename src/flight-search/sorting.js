var utils = require('../utils');

module.exports = {
  sortTrips: function (trips, sort, filter = {}) {
    if (!sort) return trips;

    const { providerTypes, providerCodes } = filter;

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

    // if provider or providerCode exists, sort in ascending with fares with provider/ providerCode first for all flights
    if (!!providerTypes && providerTypes.length > 0 || !!providerCodes && providerCodes.length > 0) {
      for (let clonedTrip of clonedTrips) {
        const isProviderTypes = fare => {
          if (!!fare && !!fare.provider) {
            const isFacilitatedBooking = providerTypes.indexOf("instant") !== -1 && fare.provider.instant;
            const isWegoFares = providerTypes.indexOf("instant") !== -1 && fare.provider.wegoFare;
            const hasProviderType = providerTypes.indexOf(fare.provider.type) !== -1 && !fare.provider.instant;
            return isFacilitatedBooking || isWegoFares || hasProviderType;
          }
          return false;
        };

        const isProviderCodes = fare => {
          const providerCode = fare.providerCode || fare.provider.code;
          return !!providerCode ? providerCodes.indexOf(providerCode) !== -1 : false;
        }

        const sortedProviderFares = [];
        const sortedNonProviderFares = [];

        for (let fare of clonedTrip.fares) {
          if (
            !!providerTypes && providerTypes.length > 0 && isProviderTypes(fare) ||
            !!providerCodes && providerCodes.length > 0 && isProviderCodes(fare)) {
            sortedProviderFares.push(fare);
          } else {
            sortedNonProviderFares.push(fare);
          }
        }

        clonedTrip.fares = sortedProviderFares.concat(sortedNonProviderFares);
      }
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

          if ((!betterTripRefundableFare && !tripRefundableFare) || (!betterTripRefundableFare && !!tripRefundableFare)) {
            return false;
          } else if (!!betterTripRefundableFare && !tripRefundableFare) {
            return true;
          } else {
            return betterTripRefundableFare.price.amountUsd < tripRefundableFare.price.amountUsd;
          }
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