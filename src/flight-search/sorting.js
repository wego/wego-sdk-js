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
        return trip.legs[legIndex].departureTimeMinutes;
      }
    }

    function getArrivalTime(legIndex) {
      return function(trip) {
        return trip.legs[legIndex].arrivalTimeMinutes;
      }
    }

    function getScore(trip) {
      return trip.score;
    }

    var getterMap = {
      PRICE: getBestFare,
      DURATION: getDuration,
      OUTBOUND_DEPARTURE_TIME: getDepartureTime(0),
      INBOUND_DEPARTURE_TIME: getDepartureTime(1),
      OUTBOUND_ARRIVAL_TIME: getArrivalTime(0),
      INBOUND_ARRIVAL_TIME: getArrivalTime(1),
      SCORE: getScore,
    };

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