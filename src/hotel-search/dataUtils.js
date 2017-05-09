module.exports = {
  prepareHotel: function(hotel, staticData) {
    function arrayToMap (items, getKeyFunc) {
      if (!items) return {};
      var map = {};
      items.forEach(function(item) {
        map[getKeyFunc(item)] = item;
      });
      return map;
    }

    hotel.district = staticData.districts[hotel.districtId];
    hotel.reviewMap = arrayToMap(hotel.reviews, function(review) {
      return review.reviewerGroup;
    });

    hotel.ratesCounts = {
      total: 0,
    };

    var amenityIdMap = {};
    var amenityIds = hotel.amenityIds || [];
    amenityIds.forEach(function(id) {
      amenityIdMap[id] = true;
    });
    hotel.amenityIdMap = amenityIdMap;
    hotel.rates = [];
    hotel.images = hotel.images || [];
  },

  prepareRate: function(rate, currency, staticData) {
    rate.provider = staticData.providers[rate.providerCode];
    rate.price = this.convertPrice(rate.price, currency);
  },

  convertPrice: function(price, currency) {
    if (!currency) return price;
    if (!price) return null;
    var amount = price.amount;
    var totalAmount = price.totalAmount;

    if (price.currencyCode != currency.code) {
      var exchangeRate = currency.rate;
      amount = Math.round(price.amountUsd * exchangeRate);
      totalAmount = Math.round(amount * price.totalAmountUsd / price.amountUsd);
    }

    return {
      currency: currency,
      amount: amount,
      totalAmount: totalAmount,
      amountUsd: price.amountUsd,
      totalAmountUsd: price.totalAmountUsd,
    };
  },

  prepareFilterOption: function(option, type, staticData) {
    var staticDataType = this.__filterOptionTypeToStaticDataType[type];
    var itemMap = staticData[staticDataType] || {};
    var item = itemMap[option.code] || {};
    option.name = item.name;
  },

  isBetterRate: function(firstRate, secondRate) {
    function processRateAmount(rate) {
      var amount = rate.price.amount;
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

    return firstRate.ecpc > secondRate.ecpc;
  },

  __filterOptionTypeToStaticDataType: {
    stars: 'stars',
    brands: 'brands',
    propertyTypes: 'propertyTypes',
    districts: 'districts',
    amenities: 'amenities',
    rateAmenities: 'rateAmenities',
    chains: 'chains',
    reviewerGroups: 'reviewerGroups',
  }
};
