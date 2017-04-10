var utils = require('../utils');

function filterByKey(key, filterMap) {
  return !filterMap || filterMap[key];
}

function filterByAllKeys(keys, filterMap) {
  if (!filterMap) return true;
  for (var i = 0; i < keys.length; i++) {
    if (!filterMap[keys[i]]) return false;
  }
  return true;
}

function filterBySomeKeys(map, filterArray) {
  if (!filterArray || filterArray.length === 0) return true;
  for (var i = 0; i < filterArray.length; i++) {
    if (map[filterArray[i]]) return true;
  }
  return false;
}

function filterByContainAllKeys(keyMap, filterKeys) {
  if (!filterKeys) return true;
  for (var i = 0; i < filterKeys.length; i++) {
    if (!keyMap[filterKeys[i]]) return false;
  }
  return true;
}

function filterByRange(value, range) {
  if (!range) return true;
  return range.min <= value && value <= range.max;
}

module.exports = {
  filterTrips: function(trips, filter) {
    if (!filter) return trips;

    function filterByPrice(trip, priceRange) {
      if (!priceRange) return true;
      return trip.fares[0] && filterByRange(trip.fares[0].price.amountUsd, priceRange);
    }

    function filterByTripOptions(trip, tripOptions) {
      if (!tripOptions) return true;
      for (var i = 0; i < tripOptions.length; i++) {
        if (tripOptions[i] === 'SAME_AIRLINE' && trip.airlineCodes.length > 1) return false;
      }
      return true;
    }

    function filterByStopoverOptions(trip, stopoverOptions) {
      if (!stopoverOptions || stopoverOptions.length === 0) return true;
      for (var i = 0; i < stopoverOptions.length; i++) {
        if (stopoverOptions[i] === 'NOT_CHANGE_AIRPORT' && trip.changeAirportAtStopover) return false
      }
      return true;
    }

    function filterByItineraryOptions(trip, itineraryOptions) {
      if (!itineraryOptions) return true;
      for (var i = 0; i < itineraryOptions.length; i++) {
        if (itineraryOptions[i] === 'NOT_OVERNIGHT' && trip.overnight) return false;
        if (itineraryOptions[i] === 'SHORT_STOPOVER' && trip.longStopover) return false;
      }
      return true;
    }

    function filterByRanges(trip, ranges, field) {
      if (!ranges) return true;
      for (var i = 0; i < ranges.length; i++) {
        var range = ranges[i];
        var leg = trip.legs[range.legIndex];
        if (!filterByRange(leg[field], range)) return false;
      }
      return true;
    }

    function filterByAirlines(trip, airlineCodeMap) {
      if (!airlineCodeMap) return true;
      if (!trip.marketingAirline) return false;
      return filterByKey(trip.marketingAirline.code, airlineCodeMap);
    }

    function arrayToMap(items) {
      if (!items || items.length === 0) return null;
      var map = {};
      items.forEach(function(item) {
        map[item] = true;
      });
      return map;
    }

    var stopCodeMap = arrayToMap(filter.stopCodes);
    var airlineCodeMap = arrayToMap(filter.airlineCodes);
    var allianceCodeMap = arrayToMap(filter.allianceCodes);
    var originAirportCodeMap = arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = arrayToMap(filter.destinationAirportCodes);

    return trips.filter(function(trip) {
      return filterByPrice(trip, filter.priceRange)
        && filterByKey(trip.stopCode, stopCodeMap)
        && filterByRanges(trip, filter.departureTimeMinutesRanges, 'departureTimeMinutes')
        && filterByRanges(trip, filter.arrivalTimeMinutesRanges, 'arrivalTimeMinutes')
        && filterByAirlines(trip, airlineCodeMap)
        && filterByAllKeys(trip.allianceCodes, allianceCodeMap)
        && filterByTripOptions(trip, filter.tripOptions)
        && filterByKey(trip.departureAirportCode, originAirportCodeMap)
        && filterByKey(trip.arrivalAirportCode, destinationAirportCodeMap)
        && filterBySomeKeys(trip.stopoverAirportCodeMap, filter.stopoverAirportCodes)
        && filterByStopoverOptions(trip, filter.stopoverOptions)
        && filterByRanges(trip, filter.durationMinutesRanges, 'durationMinutes')
        && filterByRange(trip.stopoverDurationMinutes, filter.stopoverDurationMinutesRange)
        && filterByItineraryOptions(trip, filter.itineraryOptions)
        && filterByContainAllKeys(trip.legIdMap, filter.legIds);
    });
  }
};