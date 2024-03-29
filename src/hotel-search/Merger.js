var utils = require('../utils');
var dataUtils = require('./dataUtils');

var HotelSearchClient = function (options) {
  options = options || {};
  this.currency = options.currency;
};

HotelSearchClient.prototype = {
  reset: function () {
    this.__staticData = this._getEmptyStaticData();
    this.__hotelMap = {};
    this.__hotels = [];
    this.__filter = this._getEmptyFilter();
    this.__filterOptionsMap = this._getEmptyFilterOptionsMap();
  },

  mergeResponse: function (response) {
    var hotelIds = this._getUpdatedHotelIds(response);

    this._mergeStaticData(response);
    this._mergeHotels(response.hotels);
    this._mergeFilter(Object.assign({}, response.rentalFilter, response.filter), response.providers); // Has to be in this sequence because rentalFilter contains airbnb minPrice and maxPrice which is to be overiden by filter.
    this._mergeRates(response.rates);
    this._mergeSortedRatesByBasePrice();
    this._mergeSortedRatesByTotalPrice();
    this._mergeScores(response.scores);
    this._mergeRatesCounts(response.providerRatesCounts);

    this._cloneHotels(hotelIds);
  },

  getFilter: function () {
    return this.__filter;
  },

  getProviders: function () {
    const providers = this.__staticData.providers;
    return !!providers ? Object.keys(providers).map(providerCode => providers[providerCode]) : [];
  },

  getHotels: function () {
    return this.__hotels;
  },

  getStaticData: function () {
    return this.__staticData;
  },

  updateCurrency: function (currency) {
    this.currency = currency;

    var filter = this.__filter;
    filter.minPrice = dataUtils.convertPrice(filter.minPrice, currency);
    filter.maxPrice = dataUtils.convertPrice(filter.maxPrice, currency);
    this.__filter = utils.cloneObject(this.__filter);
  },

  _mergeStaticData: function (response) {
    function merge(itemMap, items, type) {
      if (!items) return;
      if (Array.isArray(items)) {
        items.forEach(function (item) {
          var key = (type === 'providers' || type === 'cities') ? item.code : item.id;
          itemMap[key] = item;
        });
      } else {
        for (var key in items) {
          if (items.hasOwnProperty(key)) {
            itemMap[key] = items[key];
          }
        }
      }
    }

    var staticData = this.__staticData;
    this.__staticDataTypes.forEach(function (type) {
      merge(staticData[type], response[type], type);
    });
  },

  _mergeHotels: function (hotels) {
    if (!hotels) return;

    var self = this;
    var hotelMap = this.__hotelMap;

    hotels.forEach(function (hotel) {
      dataUtils.prepareHotel(hotel, self.__staticData);
      hotelMap[hotel.id] = hotelMap[hotel.id] || hotel;
    });
  },

  _mergeRates: function (newRates) {
    if (!newRates) return;
    var self = this;

    newRates.forEach(function (newRate) {
      dataUtils.prepareRateProvider(newRate, self.__staticData);

      var hotelId = newRate.hotelId;
      var hotel = self.__hotelMap[hotelId];

      if (!!hotel) {
        hotel.rates = [...hotel.rates, newRate];
      };
    });
  },

  _mergeSortedRatesByBasePrice: function () {
    var self = this;
    var sortedCloneBaseRates = [];

    for (var hotelId in self.__hotelMap) {
      if (self.__hotelMap[hotelId]) {
        sortedCloneBaseRates = utils
          .cloneArray(self.__hotelMap[hotelId].rates)
          .sort(function (a, b) {
            var totalAmountA = a.price.totalAmount,
              totalAmountB = b.price.totalAmount,
              totalTaxAmountA = a.price.totalTaxAmount,
              totalTaxAmountB = b.price.totalTaxAmount;

            if (totalAmountA - totalTaxAmountA === totalAmountB - totalTaxAmountB) {
              return b.price.ecpc - a.price.ecpc;
            } else {
              return (totalAmountA - totalTaxAmountA) - (totalAmountB - totalTaxAmountB);
            }
          });

        self.__hotelMap[hotelId].sortedRatesByBasePrice = sortedCloneBaseRates;
      }
    }
  },

  _mergeSortedRatesByTotalPrice: function () {
    var self = this;
    var sortedCloneTotalRates = [];

    for (var hotelId in self.__hotelMap) {
      if (self.__hotelMap[hotelId]) {
        sortedCloneTotalRates = utils
          .cloneArray(self.__hotelMap[hotelId].rates)
          .sort(function (a, b) {
            var totalAmountA = a.price.totalAmount;
            var totalAmountB = b.price.totalAmount;

            if (totalAmountA === totalAmountB) {
              return b.price.ecpc - a.price.ecpc;
            } else {
              return totalAmountA - totalAmountB;
            }
          });

        self.__hotelMap[hotelId].sortedRatesByTotalPrice = sortedCloneTotalRates;
      }
    }
  },

  _mergeScores: function (scores) {
    if (!scores) return;
    var hotelMap = this.__hotelMap;
    for (var hotelId in scores) {
      var hotel = hotelMap[hotelId];
      if (hotel) {
        hotel.score = scores[hotelId];
      }
    }
  },

  _mergeRatesCounts: function (providerRatesCounts) {
    if (!providerRatesCounts) return;
    var self = this;
    providerRatesCounts.forEach(function (providerRatesCount) {
      var hotel = self.__hotelMap[providerRatesCount.hotelId];
      if (!hotel) return;

      var providerCode = providerRatesCount.providerCode;
      var ratesCount = providerRatesCount.ratesCount;
      var oldCount = hotel.ratesCounts[providerCode] || 0;
      hotel.ratesCounts[providerCode] = ratesCount;
      hotel.ratesCounts.total -= oldCount;
      hotel.ratesCounts.total += ratesCount;
    });
  },

  _mergeFilter: function (newFilter, providers) {
    if (!newFilter) return;

    var filter = this.__filter;
    var self = this;

    if (newFilter.minPrice) {
      filter.minPrice = dataUtils.convertPrice(newFilter.minPrice, this.currency);
    }

    if (newFilter.maxPrice) {
      filter.maxPrice = dataUtils.convertPrice(newFilter.maxPrice, this.currency);
    }

    if (newFilter.maxBedroomsCount) {
      filter.airbnbMaxBedroomCount = newFilter.maxBedroomsCount;
    }

    this.__filterOptionTypes.forEach(function (type) {
      var options = newFilter[type] || [];

      if (type === 'providers') {
        // if type is providers, override normal procedure.
        // use providers directly instead of getting from `filters.*`
        options = providers || [];
      }

      options.forEach(function (option) {
        dataUtils.prepareFilterOption(option, type, self.__staticData);
        self.__filterOptionsMap[type][option.code] = option;
      });
      self._buildFilterOptions(type);
    });

    this.__filter = utils.cloneObject(this.__filter);
  },

  _getEmptyStaticData: function () {
    var staticData = {};
    this.__staticDataTypes.forEach(function (type) {
      staticData[type] = {};
    });
    return staticData;
  },

  _getEmptyFilterOptionsMap: function () {
    var map = {};
    this.__filterOptionTypes.forEach(function (type) {
      map[type] = {};
    });
    return map;
  },

  _buildFilterOptions: function (type) {
    this.__filter[type] = utils
      .mapValues(this.__filterOptionsMap[type])
      .sort(function (option1, option2) {
        if (option1.name < option2.name) return -1;
        else if (option1.name === option2.name) return 0;
        else return 1;
      });
  },

  _getEmptyFilter: function () {
    var filter = {};

    this.__filterOptionTypes.forEach(function (type) {
      filter[type] = [];
    });

    return filter;
  },

  _getUpdatedHotelIds: function (response) {
    var hotelIds = {};
    var self = this;
    if (response.rates) {
      response.rates.forEach(function (rate) {
        hotelIds[rate.hotelId] = true;
      });
    }

    if (response.scores) {
      for (var hotelId in response.scores) {
        hotelIds[hotelId] = true;
      }
    }

    if (response.providerRatesCounts) {
      response.providerRatesCounts.forEach(function (providerRatesCount) {
        hotelIds[providerRatesCount.hotelId] = true;
      });
    }

    return Object.keys(hotelIds).filter(function (hotelId) {
      return self.__hotelMap[hotelId];
    });
  },

  _cloneHotels: function (hotelIds) {
    var hotelMap = this.__hotelMap;
    hotelIds.forEach(function (hotelId) {
      var hotel = hotelMap[hotelId];
      if (!hotel) {
        console.error("Hotel with " + hotelId + " is missing");
        return;
      }
      hotel.rates = utils.cloneArray(hotel.rates);
      hotel.ratesCounts = utils.cloneObject(hotel.ratesCounts);
      hotelMap[hotelId] = utils.cloneObject(hotel);
    });

    this.__hotels = utils.mapValues(hotelMap);
  },

  __staticDataTypes: [
    'stars',
    'brands',
    'propertyTypes',
    'districts',
    'cities',
    'amenities',
    'rateAmenities',
    'chains',
    'providers',
    'roomTypeCategories',
    'destinationInfo'
  ],

  __filterOptionTypes: [
    'stars',
    'brands',
    'propertyTypes',
    'districts',
    'cities',
    'amenities',
    'rateAmenities',
    'chains',
    'providers',
    'reviewerGroups',
    'roomTypeCategories',
    'bookingOptions'
  ],
};

module.exports = HotelSearchClient;
