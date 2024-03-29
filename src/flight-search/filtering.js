const { cloneObject } = require('../utils');
var utils = require('../utils');

function filterByPrice(trip, priceRange) {
  if (!priceRange) return true;
  return trip.fares[0] && utils.filterByRange(trip.fares[0].price.amountUsd, priceRange);
}

/* e.g. flexibilities: ["refundable", "non_refundable"] */
function filterByFlexibleTickets(fares, flexibilities) {
  if (!flexibilities || flexibilities.length === 0) {
    return true;
  } else {
    if (flexibilities.includes('refundable')) {
      return fares.some(fare => fare.refundable);
    }
    return false;
  }
}

/*
  e.g providerFilter: {
    providerCodeMap: {'citybookers.com': true, 'rehlat.ae': true},
    providerTypes: ['instant', 'airline'],
  }
*/
function filterByProviders(trip, providerFilter, flexibilities) {
  if (!providerFilter) {
    return true;
  }

  const hasFlexibilitiesFilter = !!flexibilities && flexibilities.length > 0;
  const providerCodeMap = providerFilter.providerCodeMap;
  const providerTypes = providerFilter.providerTypes;

  if (!providerCodeMap && !providerTypes) {
    return true;
  }

  const fares = trip.fares;

  if (!!fares && fares.length > 0) {
    for (let i = 0; i < fares.length; i++) {
      const isMatchCode = isFareMatchProviderCode(fares[i], providerCodeMap);
      const isMatchType = isFareMatchProviderType(fares[i], providerTypes);
      const isMatchFlexibilitiesFilter = hasFlexibilitiesFilter ? flexibilities.includes('refundable') && fares[i].refundable : true;

      if (isMatchCode && isMatchType && isMatchFlexibilitiesFilter) {
        return true;
      }
    }
  }
  return false;
}

function isFareMatchProviderType(fare, providerTypes) {
  if (!providerTypes) return true;
  return (
    _isWegoFares(fare, providerTypes) ||
    _hasProviderType(fare, providerTypes)
  );
}

function _isWegoFares(fare, providerTypes) {
  return providerTypes.indexOf("instant") !== -1 && fare.provider.wegoFare;
}

function _hasProviderType(fare, providerTypes) {
  return providerTypes.indexOf(fare.provider.type) !== -1 &&
    !fare.provider.instant;
}

function isFareMatchProviderCode(fare, providerCodeMap) {
  if (!providerCodeMap) return true;
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
  for (var i = itineraryOptions.length; i--;) {
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

function filterByConditions(items, conditions, conditionsObj) {
  var filteredItems = [],
    conditionIds,
    conditionMapper;

  if (!_hasConditions(conditions)) {
    return true;
  }

  filteredItems = items.filter(function (item) {
    conditionIds = item["conditionIds"];
    for (var i = 0; i < conditions.length; i++) {
      conditionMapper = _conditionMap(conditions[i], conditionsObj);
      if (conditionIds && conditionIds.indexOf(conditionMapper) !== -1) {
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

function _conditionMap(condition, conditionsObj) {
  if (!conditionsObj) return;
  var conditionKeys = Object.keys(conditionsObj);

  for (var i = 0; i < conditionKeys.length; i++) {
    if (conditionsObj[conditionKeys[i]]["code"].toLowerCase() === condition) {
      return conditionsObj[conditionKeys[i]]["id"];
    }
  }
}

function filterTripCriteria(
  trip,
  filter,
  stopCodeMap,
  airlineCodeMap,
  allianceCodeMap,
  originAirportCodeMap,
  destinationAirportCodeMap,
  stopoverAirportCodesMap,
  itineraryOptionsMap,
  stopoverRanges,
  providerFilter,
  fareConditions,
  legConditions,
  multiCity) {
  if (!filterByPrice(trip, filter.priceRange)) return false;

  if (multiCity) {
    var legs = trip.legs, legsCount = legs.length;

    for (var i = 0; i < legsCount; i++) {
      var leg = legs[i];

      // if filter on this leg applied and leg's stopCode not selected
      if (stopCodeMap && stopCodeMap[i] && !stopCodeMap[i][leg.stopCode]) {
        return false;
      }

      let filterByAll = (map, legCodes) => {
        var mapCodes = map && Object.keys(map[i] || {});
        var mapCodesLength = mapCodes && mapCodes.length;
        if (mapCodesLength) {
          var found = false;
          for (var j = mapCodesLength; !found && j && j--;) {
            found = legCodes.indexOf(mapCodes[j]) >= 0;
          }
          if (!found) return false;
        }
        return true;
      }

      // filter each leg by airline codes
      if (!filterByAll(airlineCodeMap, leg.airlineCodes)) return false;

      // filter each leg by alliance codes
      if (!filterByAll(allianceCodeMap, leg.allianceCodes)) return false;

      // filter each leg by stopover codes
      if (!filterByAll(stopoverAirportCodesMap, leg.stopoverAirportCodes)) return false;

      // itinerary options for each leg (no overnight & short stopovers)
      var itineraryOptions = itineraryOptionsMap && Object.keys(itineraryOptionsMap[i] || {});
      if (!filterByItineraryOptions(leg, itineraryOptions)) return false;

      if (!filterByRanges(trip, stopoverRanges, 'stopoverDurationMinutes')) return false;

    } // end for

  } // end if multiCity

  return (multiCity || utils.filterByKey(trip.stopCode, stopCodeMap))
    && filterByRanges(trip, filter.departureTimeMinutesRanges, 'departureTimeMinutes')
    && filterByRanges(trip, filter.arrivalTimeMinutesRanges, 'arrivalTimeMinutes')
    && (multiCity || filterByAirlines(trip, airlineCodeMap))
    && (multiCity || utils.filterByAllKeys(trip.allianceCodes, allianceCodeMap))
    && filterByTripOptions(trip, filter.tripOptions)
    && utils.filterByAllKeys(trip.originAirportCodes, originAirportCodeMap)
    && utils.filterByAllKeys(trip.destinationAirportCodes, destinationAirportCodeMap)
    && (multiCity || utils.filterBySomeKeys(trip.stopoverAirportCodeMap, filter.stopoverAirportCodes))
    && filterByStopoverOptions(trip, filter.stopoverOptions)
    && filterByRanges(trip, filter.durationMinutesRanges, 'durationMinutes')
    && (multiCity || utils.filterByRange(trip.stopoverDurationMinutes, stopoverRanges && stopoverRanges[0]))
    && (multiCity || filterByItineraryOptions(trip, filter.itineraryOptions))
    && utils.filterByContainAllKeys(trip.legIdMap, filter.legIds)
    && filterByProviders(trip, providerFilter, filter.flexibilities)
    && filterByConditions(trip.fares, filter.fareTypes, fareConditions)
    && filterByConditions(trip.legs, filter.flightTypes, legConditions)
    && filterByFlexibleTickets(trip.fares, filter.flexibilities);
}

module.exports = {
  passLegConditions: function (value) {
    this.legConditions = value;
  },
  passFareConditions: function (value) {
    this.fareConditions = value;
  },
  filterTrips: function (trips, filter, multiCity) {
    if (!filter) return trips;
    var self = this;
    var stopCodes = filter.stopCodes;
    var stopCodeMap = utils.arrayToMaps(stopCodes, multiCity);
    var airlineCodeMap = utils.arrayToMaps(filter.airlineCodes, multiCity);
    var allianceCodeMap = utils.arrayToMaps(filter.allianceCodes, multiCity);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);
    var stopoverAirportCodesMap = multiCity && utils.arrayToMaps(filter.stopoverAirportCodes, multiCity);
    var itineraryOptionsMap = multiCity && utils.arrayToMaps(filter.itineraryOptions, multiCity);
    var stopoverRanges = filter.stopoverDurationMinutesRanges;

    var providerCodeMap = utils.arrayToMap(filter.providerCodes);
    var providerTypes = filter.providerTypes;
    var providerFilter = { providerCodeMap, providerTypes };

    return trips.filter(function (trip) {
      return filterTripCriteria(
        trip,
        filter,
        stopCodeMap,
        airlineCodeMap,
        allianceCodeMap,
        originAirportCodeMap,
        destinationAirportCodeMap,
        stopoverAirportCodesMap,
        itineraryOptionsMap,
        stopoverRanges,
        providerFilter,
        self.fareConditions,
        self.legConditions,
        multiCity);
    });
  },

  filterSponsors: function (sponsors, trips, filter, multiCity) {
    if (!filter) {
      return sponsors;
    }

    var self = this;
    var stopCodes = filter.stopCodes;
    var stopCodeMap = utils.arrayToMaps(stopCodes, multiCity);
    var airlineCodeMap = utils.arrayToMaps(filter.airlineCodes, multiCity);
    var allianceCodeMap = utils.arrayToMaps(filter.allianceCodes, multiCity);
    var originAirportCodeMap = utils.arrayToMap(filter.originAirportCodes);
    var destinationAirportCodeMap = utils.arrayToMap(filter.destinationAirportCodes);
    var stopoverAirportCodesMap = multiCity && utils.arrayToMaps(filter.stopoverAirportCodes, multiCity);
    var itineraryOptionsMap = multiCity && utils.arrayToMaps(filter.itineraryOptions, multiCity);
    var stopoverRanges = filter.stopoverDurationMinutesRanges;

    var providerCodeMap = utils.arrayToMap(filter.providerCodes);
    var providerTypes = filter.providerTypes;
    var providerFilter = { providerCodeMap, providerTypes };

    return sponsors.filter(function (sponsor) {
      let trip = trips.find(trip => {
        return trip.id === sponsor.fareView.tripId;
      });
      if (!!trip) {
        trip = cloneObject(trip);
        trip.fares = trip.fares.filter(fare => fare.id === sponsor.fareView.id);
      }

      return filterTripCriteria(
        trip,
        filter,
        stopCodeMap,
        airlineCodeMap,
        allianceCodeMap,
        originAirportCodeMap,
        destinationAirportCodeMap,
        stopoverAirportCodesMap,
        itineraryOptionsMap,
        stopoverRanges,
        providerFilter,
        self.fareConditions,
        self.legConditions,
        multiCity);
    });
  }
};
