var utils = require('../utils');

function filterByPrice(trip, priceRange) {
  if (!priceRange) return true;
  return trip.fares[0] && utils.filterByRange(trip.fares[0].price.amountUsd, priceRange);
}

/*
  e.g providerFilter: {
    providerCodeMap: {'citybookers.com': true, 'rehlat.ae': true},
    providerTypes: ['instant', 'airline'],
  }
*/
function filterByProviders(trip, providerFilter) {
  if (!providerFilter) return true;

  var providerCodeMap = providerFilter.providerCodeMap;
  var providerTypes = providerFilter.providerTypes;

  if (!providerCodeMap && !providerTypes) return true;

  var fares = trip.fares;
  if (!fares) return false;
  for (var i = 0; i < fares.length; i++) {
    var isMatchCode = isFareMatchProviderCode(fares[i], providerCodeMap);
    var isMatchType = isFareMatchProviderType(fares[i], providerTypes);
    if (isMatchCode && isMatchType) return true;
  }
  return false;
}

function isFareMatchProviderType (fare, providerTypes) {
  if (!providerTypes) return true;
  var isMatchTypeInstant = (fare.provider.instant && providerTypes.includes('instant'));
  return isMatchTypeInstant || (providerTypes.includes(fare.provider.type));
}

function isFareMatchProviderCode (fare, providerCodeMap) {
  if(!providerCodeMap) return true;
  return utils.filterByKey(fare.provider.code, providerCodeMap);
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
    if (itineraryOptions[i] === 'NOT_OVERNIGHT' && !trip.overnight) return true;
    if (itineraryOptions[i] === 'SHORT_STOPOVER' && !trip.longStopover) return true;
  }
  return false;
}

function filterByRanges(trip, ranges, field) {
  if (!ranges) return true;
  for (var i = 0; i < ranges.length; i++) {
    var range = ranges[i];
    var leg = trip.legs[range.legIndex];
    if (!utils.filterByRange(leg[field], range)) return false;
  }
  return true;
}

function filterByAirlines(trip, airlineCodeMap) {
  if (!airlineCodeMap) return true;
  if (!trip.marketingAirline) return false;
  return utils.filterByKey(trip.marketingAirline.code, airlineCodeMap);
}

function isBothAirlineAndInstant(value) {
  return value.provider.type === 'airline' || value.provider.instant;
}

function filterByConditions(items, conditions) {
  var filteredItems = [],
    conditionIds;

  if (!_hasConditions(conditions)) {
    return true;
  }

  filteredItems = items.filter(function(item) {
    conditionIds = item["conditionIds"];

    for (var i = 0; i < conditions.length; i++) {
      if (conditionIds && conditionIds.indexOf(_conditionMap(conditions[i])) !== -1) {
        return true;
      }
    }
    return false;
  });

  return filteredItems.length >= 1;
}

function _hasConditions(conditions) {
  return !!conditions && conditions.length !== 0;
}

function _conditionMap(condition) {
  return ({
    "refundable": 1,
    "non_refundable": 2,
    "chartered": 3,
    "scheduled": 4
  })[condition];
}

module.exports = {
  filterTrips: function(trips, filter) {
    if (!filter) return trips;

    var stopCodeMap = utils.arrayToMap(filter.stopCodes);
    var airlineCodeMap = utils.arrayToMap(filter.airlineCodes);
    var allianceCodeMap = utils.arrayToMap(filter.allianceCodes);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);

    var providerCodeMap = utils.arrayToMap(filter.providerCodes);
    var providerTypes = filter.providerTypes;
    var providerFilter = {providerCodeMap, providerTypes};

    var filteredTrips = trips.filter(function(trip) {
      return filterByPrice(trip, filter.priceRange)
        && utils.filterByKey(trip.stopCode, stopCodeMap)
        && filterByRanges(trip, filter.departureTimeMinutesRanges, 'departureTimeMinutes')
        && filterByRanges(trip, filter.arrivalTimeMinutesRanges, 'arrivalTimeMinutes')
        && filterByAirlines(trip, airlineCodeMap)
        && utils.filterByAllKeys(trip.allianceCodes, allianceCodeMap)
        && filterByTripOptions(trip, filter.tripOptions)
        && utils.filterByAllKeys(trip.originAirportCodes, originAirportCodeMap)
        && utils.filterByAllKeys(trip.destinationAirportCodes, destinationAirportCodeMap)
        && utils.filterBySomeKeys(trip.stopoverAirportCodeMap, filter.stopoverAirportCodes)
        && filterByStopoverOptions(trip, filter.stopoverOptions)
        && filterByRanges(trip, filter.durationMinutesRanges, 'durationMinutes')
        && utils.filterByRange(trip.stopoverDurationMinutes, filter.stopoverDurationMinutesRange)
        && filterByItineraryOptions(trip, filter.itineraryOptions)
        && utils.filterByContainAllKeys(trip.legIdMap, filter.legIds)
        && filterByProviders(trip, providerFilter)
        && filterByConditions(trip.fares, filter.fareTypes)
        && filterByConditions(trip.legs, filter.flightTypes);
    });

    return filteredTrips;
  }
};
