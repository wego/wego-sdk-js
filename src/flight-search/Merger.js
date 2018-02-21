var dataUtils = require('./dataUtils');
var utils = require('../utils');

var FlightSearchMerger = function(options) {
  options = options || {};
  this.currency  = options.currency;
};

FlightSearchMerger.prototype = {
  mergeResponse: function(response) {
    var updatedTripIds = this._getUpdatedTripIds(response);

    this._mergeStaticData(response);
    this._mergeLegs(response.legs);
    this._mergeLegConditions(response.legConditionIds);
    this._mergeTrips(response.trips);
    this._mergeFilter(response.filters);
    this._mergeScores(response.scores);
    this._mergeFares(response.fares);

    this._cloneTrips(updatedTripIds);
  },

  reset: function() {
    this.__staticData = this._getEmptyStaticData();
    this.__legMap = {};
    this.__tripMap = {};
    this.__trips = [];
    this.__filter = this._getEmptyFilter();
    this.__filterOptionsMap = this._getEmptyFilterOptionsMap();
  },

  getTrips: function() {
    return this.__trips;
  },

  getFilter: function() {
    return this.__filter;
  },

  updateCurrency: function(currency) {
    this.currency = currency;
    var self = this;

    var tripMap = this.__tripMap;
    for (var tripId in tripMap) {
      tripMap[tripId].fares.forEach(function(fare) {
        fare.price = dataUtils.convertPrice(fare.price, currency);
        fare.paymentFees = dataUtils.convertPaymentFees(fare.paymentFees, currency);
      });
    }
    this._cloneTrips(Object.keys(tripMap));

    var filter = this.__filter;
    this.__filterOptionTypes.forEach(function(type) {
      var optionMap = self.__filterOptionsMap[type];
      for (var code in optionMap) {
        var option = optionMap[code];
        option.price = dataUtils.convertPrice(option.price, currency);
        optionMap[code] = utils.cloneObject(option);
      }
      self._buildFilterOptions(type);
    });
    filter.minPrice = dataUtils.convertPrice(filter.minPrice, currency);
    filter.maxPrice = dataUtils.convertPrice(filter.maxPrice, currency);
    this._cloneFilter();
  },

  _mergeStaticData: function(response) {
    var staticData = this.__staticData;

    function merge(itemMap, items, type) {
      if (!items) return;
      items.forEach(function(item) {
        var key = item.id || item.code;
        itemMap[key] = item;
        if (type === 'airports') {
          item.city = staticData.cities[item.cityCode];
        } else if (type === 'cities') {
          item.country = staticData.countries[item.countryCode];
        }
      });
    }

    this.__staticDataTypes.forEach(function(type) {
      merge(staticData[type], response[type], type);
    });
  },

  _mergeLegs: function(newLegs) {
    if (!newLegs) return;
    var self = this;
    var legMap = this.__legMap;
    newLegs.forEach(function(newLeg) {
      var legId = newLeg.id;
      if (!legMap[legId]) {
        dataUtils.prepareLeg(newLeg, self.__staticData);
        legMap[legId] = newLeg;
      }
    });
  },

  _mergeLegConditions: function(newLegConditions) {
    if (!newLegConditions) return;
    var self = this;
    var legMap = this.__legMap;
    Object.keys(newLegConditions).forEach(function(legId) {
      if (legMap[legId]) {
        legMap[legId]["conditionIds"] = newLegConditions[legId]; 
      }
    });
  },

  _mergeTrips: function(newTrips) {
    if (!newTrips) return;
    var self = this;
    var tripMap = this.__tripMap;
    newTrips.forEach(function(newTrip) {
      var tripId = newTrip.id;
      if (!tripMap[tripId]) {
        var legIds = newTrip.legIds || [];
        newTrip.legs = legIds.map(function(legId) {
          return self.__legMap[legId];
        });

        dataUtils.prepareTrip(newTrip);
        tripMap[tripId] = newTrip;
      }
    });
  },

  _mergeFares: function(newFares) {
    if (!newFares) return;
    var self = this;
    newFares.forEach(function(newFare) {
      dataUtils.prepareFare(newFare, self.currency, self.__staticData);
      var tripId = newFare.tripId;
      var trip = self.__tripMap[tripId];
      if (!trip) return;

      var fares = trip.fares;
      var i = 0;
      for(; i < fares.length; i++) {
        if (newFare.id === fares[i].id) return;
        if (newFare.price.amountUsd < fares[i].price.amountUsd) break;
      }
      fares.splice(i, 0, newFare);
    });
  },

  _mergeScores: function(scores) {
    if (!scores) return;
    var tripMap = this.__tripMap;
    for (var tripId in scores) {
      var trip = tripMap[tripId];
      if (trip) {
        trip.score = scores[tripId];
      }
    }
  },

  _mergeFilter: function(newFilter) {
    if (!newFilter) return;
    var self = this;

    var filter = this.__filter;

    if (newFilter.legs) {
      newFilter.legs.forEach(function(leg) {
        dataUtils.prepareLegFilter(leg, self.__staticData);
      });
      filter.legs = newFilter.legs;
    }

    if (newFilter.minPrice) {
      filter.minPrice = dataUtils.convertPrice(newFilter.minPrice, this.currency);
    }

    if (newFilter.maxPrice) {
      filter.maxPrice = dataUtils.convertPrice(newFilter.maxPrice, this.currency);
    }

    if (newFilter.stopoverDurations) {
      filter.stopoverDurations = newFilter.stopoverDurations;
    }

    this.__filterOptionTypes.forEach(function(type) {
      var options = newFilter[type] || [];
      options.forEach(function(option) {
        dataUtils.prepareFilterOption(option, type, self.currency, self.__staticData);
        self.__filterOptionsMap[type][option.code] = option;
      });
      self._buildFilterOptions(type);
    });

    this._cloneFilter();
  },

  _getUpdatedTripIds: function(response) {
    var tripIds = {};
    var self = this;
    if (response.scores) {
      for (var tripId in response.scores) {
        tripIds[tripId] = true;
      }
    }

    if (response.fares) {
      response.fares.forEach(function(fare) {
        tripIds[fare.tripId] = true;
      });
    }

    return Object.keys(tripIds).filter(function(tripId) {
      return self.__tripMap[tripId];
    });
  },

  _cloneTrips: function(tripIds) {
    var tripMap = this.__tripMap;
    tripIds.forEach(function(tripId) {
      var trip = tripMap[tripId];
      if (!trip) {
        console.error("Trip with " + tripId + " is missing");
        return;
      }
      trip.fares = utils.cloneArray(trip.fares);
      tripMap[tripId] = utils.cloneObject(trip);
    });

    this.__trips = utils.mapValues(tripMap);
  },

  _cloneFilter: function() {
    this.__filter = utils.cloneObject(this.__filter);
  },

  _buildFilterOptions: function(type) {
    this.__filter[type] = utils.mapValues(this.__filterOptionsMap[type]);
    this.__filter[type].sort(function(option1, option2) {
      if (type === 'stops') {
        var codes = ['DIRECT','ONE_STOP', 'MORE_THAN_ONE_STOP'];
        return codes.indexOf(option1.code) - codes.indexOf(option2.code);
      } else {
        if (option1.name < option2.name) return -1;
        else if (option1.name === option2.name) return 0;
        else return 1;
      }
    });
  },

  _getEmptyFilter: function() {
    var filter = {
      legs: [],
    };

    this.__filterOptionTypes.forEach(function(type) {
      filter[type] = [];
    });

    return filter;
  },

  _getEmptyFilterOptionsMap: function() {
    var map = {};
    this.__filterOptionTypes.forEach(function(type) {
      map[type] = {};
    });
    return map;
  },

  _getEmptyStaticData: function() {
    var staticData = {};
    this.__staticDataTypes.forEach(function(type) {
      staticData[type] = {};
    });
    return staticData;
  },

  __staticDataTypes: [
    'countries',
    'cities',
    'airlines',
    'airports',
    'providers',
    'stops',
    'alliances',
    'legConditions'
  ],

  __filterOptionTypes: [
    'airlines',
    'providers',
    'stops',
    'alliances',
    'originAirports',
    'destinationAirports',
    'stopoverAirports',
  ],
};

module.exports = FlightSearchMerger;
