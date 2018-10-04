var utils = require('../utils');

module.exports = {
  sortTrips: function(trips, sort) {
    if (!sort) return trips;

    function getBestFare(trip) {
      if (!trip.fares[0]) return null;
      return trip.fares[0].price.amountUsd;
    }

    function getDuration(trip) {
      return trip.durationMinutes;
    }

    function getDepartureTime(legIndex) {
      return function(trip) {
        var leg = trip.legs[legIndex];
        return leg && leg.departureTimeMinutes;
      }
    }

    function getArrivalTime(legIndex) {
      return function(trip) {
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
    for(var i=0; i<6; i++) {
      getterMap['LEG' + (i+1) + '_DEPARTURE_TIME'] = getDepartureTime(i);
      getterMap['LEG' + (i+1) + '_ARRIVAL_TIME'] = getArrivalTime(i);
    }

    var propertyGetter = getterMap[sort.by] || function() {};
    var clonedTrips = utils.cloneArray(trips);

    clonedTrips.sort(function(trip1, trip2) {
      var compareResult = utils.compare(trip1, trip2, propertyGetter, sort.order);
      if (compareResult == 0 && sort.by != 'PRICE') {
        return utils.compare(trip1, trip2, getBestFare, 'ASC');
      } else {
        return compareResult;
      }
    });

    return clonedTrips;
  },

  getCheapestTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
    });
  },

  getFastestTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      if (betterTrip.durationMinutes === trip.durationMinutes) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.durationMinutes < trip.durationMinutes;
    });
  },

  getBestExperienceTrip: function(trips) {
    return this._getBestTripBy(trips, function(betterTrip, trip) {
      if (betterTrip.score === trip.score) {
        return betterTrip.fares[0].price.amountUsd < trip.fares[0].price.amountUsd;
      }
      return betterTrip.score > trip.score;
    });
  },

  _getBestTripBy: function(trips, isBetterFunc) {
    var bestTrip = trips[0];
    for (var i = 1; i < trips.length; i++) {
      if (isBetterFunc(trips[i], bestTrip)) {
        bestTrip = trips[i];
      }
    }
    return bestTrip;
  }
};