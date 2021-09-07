var dataUtils = require('./dataUtils');
var utils = require('../utils');

var FlightSearchMerger = function (options) {
  options = options || {};
  this.currency = options.currency;
};

FlightSearchMerger.prototype = {
  mergeResponse: function (response) {
    var self = this,
      updatedTripIds = self._getUpdatedTripIds(response),
      legs = response.legs;

    self._mergeStaticData(response);
    self._mergeLegs(legs);
    self._mergeLegConditions(response.legConditionIds);
    self._mergeTrips(response.trips);
    self._mergeFilter(response.filters);
    self._mergeScores(response.scores);
    self._mergeFares(response.fares);
    self._mergeInlineAdTrips(response.sponsor);

    self._cloneTrips(updatedTripIds);
  },

  reset: function () {
    this.__staticData = this._getEmptyStaticData();
    this.__legMap = {};
    this.__tripMap = {};
    this.__trips = [];
    this.__filter = this._getEmptyFilter();
    this.__filterOptionsMap = this._getEmptyFilterOptionsMap();
    this.__inlineAdTrips = {};
  },

  getTrips: function () {
    return this.__trips;
  },

  getLegConditions: function () {
    return this.__staticData["legConditions"];
  },

  getFareConditions: function () {
    return this.__staticData["fareConditions"];
  },

  getProviders: function () {
    const providers = this.__staticData.providers;
    return Object.keys(providers).map(providerCode => providers[providerCode]);
  },

  getFilter: function () {
    return this.__filter;
  },

  getInlineAdTrips: function () {
    return Object.keys(this.__inlineAdTrips).map(key => this.__inlineAdTrips[key]);
  },

  updateCurrency: function (currency) {
    var self = this;
    self.currency = currency;

    var tripMap = self.__tripMap;
    for (var tripId in tripMap) {
      tripMap[tripId].fares.forEach(function (fare) {
        fare.price = dataUtils.convertPrice(fare.price, currency);
        fare.paymentFees = dataUtils.convertPaymentFees(fare.paymentFees, currency);
      });
    }
    self._cloneTrips(Object.keys(tripMap));

    var filter = self.__filter;
    self.__filterOptionTypes.forEach(function (type) {
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
    self._cloneFilter();
  },

  _mergeStaticData: function (response) {
    var staticData = this.__staticData;

    function merge(itemMap, items, type) {
      if (!items) return;
      items.forEach(function (item) {
        var key = item.id || item.code;
        itemMap[key] = item;
        if (type === 'airports') {
          item.city = staticData.cities[item.cityCode];
        } else if (type === 'cities') {
          item.country = staticData.countries[item.countryCode];
        }
      });
    }

    this.__staticDataTypes.forEach(function (type) {
      merge(staticData[type], response[type], type);
    });
  },

  _mergeLegs: function (newLegs) {
    if (!newLegs) return;
    var self = this;
    var legMap = this.__legMap;
    newLegs.forEach(function (newLeg) {
      var legId = newLeg.id;
      if (!legMap[legId]) {
        dataUtils.prepareLeg(newLeg, self.__staticData);
        legMap[legId] = newLeg;
      }
    });
  },

  _mergeLegConditions: function (newLegConditions) {
    if (!newLegConditions) return;
    var self = this;
    var legMap = this.__legMap;
    var legConditions = this.__staticData.legConditions;
    Object.keys(newLegConditions).forEach(function (legId) {
      if (legMap[legId]) {
        legMap[legId].conditions = newLegConditions[legId].map(function (legConditionId) {
          return legConditions[legConditionId];
        });
        legMap[legId].conditionIds = newLegConditions[legId];
      }
    });
  },

  _mergeTrips: function (newTrips) {
    if (!newTrips) return;
    var self = this;
    var tripMap = this.__tripMap;
    newTrips.forEach(function (newTrip) {
      var tripId = newTrip.id;
      if (!tripMap[tripId]) {
        var legIds = newTrip.legIds || [];
        newTrip.legs = legIds.map(function (legId) {
          return self.__legMap[legId];
        });

        dataUtils.prepareTrip(newTrip);
        tripMap[tripId] = newTrip;
      }
    });
  },

  _mergeFares: function (newFares) {
    if (!newFares) return;
    var self = this;
    newFares.forEach(function (newFare) {
      dataUtils.prepareFare(newFare, self.currency, self.__staticData);
      var tripId = newFare.tripId;
      var trip = self.__tripMap[tripId];
      if (!trip) return;

      var fares = trip.fares;
      var i = 0;
      for (; i < fares.length; i++) {
        if (newFare.id === fares[i].id) return;
        if (newFare.price.amountUsd < fares[i].price.amountUsd) break;
      }
      fares.splice(i, 0, newFare);
    });
  },

  _mergeScores: function (scores) {
    if (!scores) return;
    var tripMap = this.__tripMap;
    for (var tripId in scores) {
      var trip = tripMap[tripId];
      if (trip) {
        trip.score = scores[tripId];
      }
    }
  },

  _mergeInlineAdTrips: function (sponsors) {
    if (!sponsors || sponsors.length === 0) return;
    for (var sponsor of sponsors) {
      var key = `${sponsor.fare.providerCode}-${sponsor.fare.price.amount}`;
      var trip = this.__tripMap[sponsor.fare.tripId];
      sponsor.fare.trip = trip;
      sponsor.fare.legs = trip.legIds.map(legId => this.__legMap[legId]);
      sponsor.fare.provider = this.__staticData.providers[sponsor.fare.providerCode];

      this.__inlineAdTrips[key] = sponsor;
    }
  },

  _mergeFilter: function (newFilter) {
    if (!newFilter) return;
    var self = this,
      filter = self.__filter,
      multiCity = self.multiCity,
      newFilterLegs = newFilter.legs;

    if (newFilterLegs) {
      newFilterLegs.forEach(function (leg) {
        dataUtils.prepareLegFilter(leg, self.__staticData);
      });
      filter.legs = newFilterLegs;
    }

    if (newFilter.minPrice) {
      filter.minPrice = dataUtils.convertPrice(newFilter.minPrice, self.currency);
    }

    if (newFilter.maxPrice) {
      filter.maxPrice = dataUtils.convertPrice(newFilter.maxPrice, self.currency);
    }

    if (newFilter.stopoverDurations) {
      filter.stopoverDurations = newFilter.stopoverDurations;
    }

    var stopCodesMap = { 'DIRECT': 0, 'ONE_STOP': 1, 'MORE_THAN_ONE_STOP': 2 };

    self.__filterOptionTypes.forEach(type => {

      let buildOptions = (options, legIndex) => {
        options && options.forEach(option => {
          var isByLeg = legIndex >= 0;
          if (type === 'stops') option.code = stopCodesMap[option.code];
          var code = (isByLeg ? (legIndex + 1) + '_' : '') + option.code;
          dataUtils.prepareFilterOption(option, type, self.currency, self.__staticData);
          self.__filterOptionsMap[type][code] = option;
          option.code = code;
          isByLeg && (option.legIndex = legIndex);
        });
      }

      if (multiCity && newFilterLegs) {
        for (var i = newFilterLegs.length; i--;) {
          buildOptions(newFilterLegs[i][type], i);
        }
      }
      else {
        buildOptions(newFilter[type]);
      }
      self._buildFilterOptions(type);
    });

    self._cloneFilter();
  },

  _getUpdatedTripIds: function (response) {
    var tripIds = {};
    var self = this;
    if (response.scores) {
      for (var tripId in response.scores) {
        tripIds[tripId] = true;
      }
    }

    if (response.fares) {
      response.fares.forEach(function (fare) {
        tripIds[fare.tripId] = true;
      });
    }

    return Object.keys(tripIds).filter(function (tripId) {
      return self.__tripMap[tripId];
    });
  },

  _cloneTrips: function (tripIds) {
    var tripMap = this.__tripMap;
    tripIds.forEach(function (tripId) {
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

  _cloneFilter: function () {
    this.__filter = utils.cloneObject(this.__filter);
  },

  _buildFilterOptions: function (type) {
    var self = this, values = utils.mapValues(self.__filterOptionsMap[type]);
    values.sort((option1, option2) => {
      if (type === 'stops') {
        var code1 = option1.code, code2 = option2.code;

        // multi city has leg prefix. i.e: '1_0' (leg 0 direct), '3_1' (leg 2 one stop)
        if (self.multiCity) {
          code1 = code1.substr(2);
          code2 = code2.substr(2);
        }
        return code1 - code2;
      } else {
        if (option1.name < option2.name) return -1;
        else if (option1.name === option2.name) return 0;
        else return 1;
      }
    });
    self.__filter[type] = values;
  },

  _getEmptyFilter: function () {
    var filter = {
      legs: [],
    };

    this.__filterOptionTypes.forEach(function (type) {
      filter[type] = [];
    });

    return filter;
  },

  _getEmptyFilterOptionsMap: function () {
    var map = {};
    this.__filterOptionTypes.forEach(function (type) {
      map[type] = {};
    });
    return map;
  },

  _getEmptyStaticData: function () {
    var staticData = {};
    this.__staticDataTypes.forEach(function (type) {
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
    'fareConditions',
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
    'fareConditions',
    'legConditions'
  ],
};

module.exports = FlightSearchMerger;
