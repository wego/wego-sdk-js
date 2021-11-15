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
    hotel.propertyType = staticData.propertyTypes[hotel.propertyTypeId];
    hotel.provider = staticData.propertyTypes[hotel.provider];

    // Check for airbnb
    if (hotel.badges && hotel.propertyTypeId === 39) {
      var roomTypeCategory = staticData.roomTypeCategories[hotel.roomTypeCategoryId];

      // Re-use badges array for room type category
      if (roomTypeCategory) {
        hotel.badges.push({ text: roomTypeCategory.name });
      }
    }
  },

  prepareRate: function (rate, currency, staticData) {
    rate.provider = staticData.providers[rate.providerCode];
    rate.price = this.convertPrice(rate.price, currency);
  },

  convertPrice: function (price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount,
      totalAmount = price.totalAmount,
      taxAmount = price.taxAmount,
      totalTaxAmount = price.totalTaxAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(price.amountUsd * exchangeRate);
      totalAmount = amount * Math.round(price.totalAmountUsd / price.amountUsd);
      taxAmount = Math.round(price.taxAmountUsd * exchangeRate);
      totalTaxAmount = taxAmount * Math.round(price.totalTaxAmountUsd / price.taxAmountUsd);
    }

    var convertedPrice = utils.cloneObject(price);
    convertedPrice.currency = currency;
    convertedPrice.amount = amount;
    convertedPrice.totalAmount = totalAmount;
    convertedPrice.taxAmount = taxAmount;
    convertedPrice.totalTaxAmount = totalTaxAmount;

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

  __filterOptionTypeToStaticDataType: {
    stars: 'stars',
    brands: 'brands',
    propertyTypes: 'propertyTypes',
    districts: 'districts',
    cities: 'cities',
    amenities: 'amenities',
    rateAmenities: 'rateAmenities',
    chains: 'chains',
    providers: 'providers',
    reviewerGroups: 'reviewerGroups',
    roomTypeCategories: 'roomTypeCategories',
    bookingOptions: 'bookingOptions'
  }
};
