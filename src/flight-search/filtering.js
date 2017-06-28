var utils = require('../utils');

function filterByPrice(trip, priceRange) {
  if (!priceRange) return true;
  return trip.fares[0] && utils.filterByRange(trip.fares[0].price.amountUsd, priceRange);
}

function filterByProviderTypes(trip, providerTypes) {
  if (!providerTypes) return true;
  var fares = trip.fares;

  if (!fares) return false;
  for (var i = 0; i < fares.length; i++) {
    if (fares[i].provider.instant && providerTypes.includes('instant')) return true;
    if (providerTypes.includes(fares[i].provider.type)) return true;
  }

  return false;
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

function filterFaresByProviderTypes(filteredTrips, providerTypes) {
  var allFaresOrig = filteredTrips.filter(function(v){ return v.faresOrig;});

  if (allFaresOrig.length > 0) {
    for (var i = 0; i < allFaresOrig.length; i++) {
      allFaresOrig[i].fares = allFaresOrig[i].faresOrig;
      delete allFaresOrig[i].faresOrig;
    }
  }

  if (providerTypes) {
    for (var i = 0; i < filteredTrips.length; i++) {
      if (filteredTrips[i].faresOrig === undefined) {
        filteredTrips[i].faresOrig = filteredTrips[i].fares;
      }
      if (providerTypes.includes('airline') && providerTypes.includes('instant')) {
        filteredTrips[i].fares = filteredTrips[i].fares.filter(isBothAirlineAndInstant);
      } else if (providerTypes.includes('airline')) {
        filteredTrips[i].fares = filteredTrips[i].fares.filter(function(v) { return v.provider.type === 'airline' && !v.provider.instant; });
      } else if (providerTypes.includes('instant')) {
        filteredTrips[i].fares = filteredTrips[i].fares.filter(function(v) { return v.provider.instant; });
      }
    }
  }

  return filteredTrips;
}

module.exports = {
  filterTrips: function(trips, filter) {
    if (!filter) return trips;

    var stopCodeMap = utils.arrayToMap(filter.stopCodes);
    var airlineCodeMap = utils.arrayToMap(filter.airlineCodes);
    var allianceCodeMap = utils.arrayToMap(filter.allianceCodes);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);

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
        && filterByProviderTypes(trip, filter.providerTypes);
    });

    filteredTrips = filterFaresByProviderTypes(filteredTrips, filter.providerTypes);

    return filteredTrips;
  }
};