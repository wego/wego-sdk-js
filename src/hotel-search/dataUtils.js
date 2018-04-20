var utils = require('../utils');

module.exports = {
  prepareResponseSearch: function (search, staticData) {
    var region = search && search.region;
    if (region) {
      var cities = [];
      var staticCities = staticData.cities;
      region.cityCodes.forEach(function (cityCode) {
        cities.push(staticCities[cityCode]);
      });
      region.cities = cities;
    }
  },

  prepareHotel: function (hotel, staticData) {
    function arrayToMap(items, getKeyFunc) {
      if (!items) return {};
      var map = {};
      items.forEach(function (item) {
        map[getKeyFunc(item)] = item;
      });
      return map;
    }

    hotel.district = staticData.districts[hotel.districtId];
    hotel.city = staticData.cities[hotel.cityCode];
    hotel.reviewMap = arrayToMap(hotel.reviews, function (review) {
      return review.reviewerGroup;
    });

    hotel.ratesCounts = {
      total: 0,
    };

    var amenityIdMap = {};
    var amenityIds = hotel.amenityIds || [];
    amenityIds.forEach(function (id) {
      amenityIdMap[id] = true;
    });
    hotel.amenityIdMap = amenityIdMap;
    hotel.rates = [];
    hotel.images = hotel.images || [];

    // Check for airbnb
    if (hotel.badges.length === 0 && hotel.propertyTypeId === 39) {
      var roomTypeCategory = staticData.roomTypeCategories[hotel.roomTypeCategoryId];

      // Re-use badges array.
      hotel.badges.push({ text: roomTypeCategory.name });
    }
  },

  prepareRate: function (rate, currency, staticData) {
    rate.provider = staticData.providers[rate.providerCode];
    rate.price = this.convertPrice(rate.price, currency);
  },

  convertPrice: function (price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount;
    var totalAmount = price.totalAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(price.amountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
    }

    var convertedPrice = utils.cloneObject(price);
    convertedPrice.currency = currency;
    convertedPrice.amount = amount;
    convertedPrice.totalAmount = totalAmount;

    return convertedPrice;
  },

  prepareFilterOption: function (option, type, staticData) {
    var staticDataType = this.__filterOptionTypeToStaticDataType[type];
    var itemMap = staticData[staticDataType] || {};
    var item = itemMap[option.code] || {};
    option.name = item.name;
  },

  trimArray: function (value) {
    if (!value) return;

    if (Array.isArray(value)) {
      value = value.filter(
        function (entry) {
          if (!entry) return false;
          return entry.trim() != '';
        }
      );
    }

    return value;
  },

  isBetterRate: function (firstRate, secondRate) {
    function processRateAmount(rate) {
      var amount = Math.round(rate.price.amount);
      if (amount > 99999) {
        amount = (amount / 100) * 100;
      }
      return amount;
    }

    function getPriceTaxAmountInclusive(rate) {
      return rate.price.taxAmountUsd < 0 ? -1 : 1;
    }

    var firstTax = getPriceTaxAmountInclusive(firstRate);
    var secondTax = getPriceTaxAmountInclusive(secondRate);

    if (firstTax != secondTax) return firstTax > secondTax;

    var firstRateAmount = processRateAmount(firstRate);
    var secondRateAmount = processRateAmount(secondRate);
    if (firstRateAmount != secondRateAmount) return firstRateAmount < secondRateAmount;

    if (firstRate.provider.type == 'DIRECT_PRIORITY' && secondRate.provider.type != 'DIRECT_PRIORITY') {
      return true;
    } else if (secondRate.provider.type == 'DIRECT_PRIORITY' && firstRate.provider.type != 'DIRECT_PRIORITY') {
      return false;
    }

    return firstRate.price.ecpc > secondRate.price.ecpc;
  },

  __filterOptionTypeToStaticDataType: {
    stars: 'stars',
    brands: 'brands',
    propertyTypes: 'propertyTypes',
    districts: 'districts',
    cities: 'cities',
    amenities: 'amenities',
    rateAmenities: 'rateAmenities',
    chains: 'chains',
    reviewerGroups: 'reviewerGroups',
  }
};
