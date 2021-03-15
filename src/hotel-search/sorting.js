var utils = require('../utils');

module.exports = {
  sortHotels: function (hotels, sort, filter = {}) {
    if (!sort) return hotels;

    const { providers = [], providerCodes = [] } = filter;

    function getPrice(hotel) {
      if (hotel.rates && hotel.rates.length > 0) {
        return hotel.rates[0].price.amountUsd;
      } else {
        return null;
      }
    }

    function _getDiscount(hotel) {
      if (_hasRates(hotel) && _hasUsualPrice(hotel.rates[0]['usualPrice'])) {
        return Math.round(hotel.rates[0]['usualPrice']['discountToUsualAmount'] * 100);
      } else {
        return null;
      }
    }

    function _getSavings(hotel) {
      var usualPrice;

      if (_hasRates(hotel) && _hasUsualPrice(hotel.rates[0]['usualPrice'])) {
        usualPrice = hotel.rates[0]['usualPrice'];

        return Math.round(usualPrice['usualAmountUsd'] * usualPrice['discountToUsualAmount']);
      } else {
        return null;
      }
    }

    function _hasRates(hotel) {
      return hotel.rates && hotel.rates.length > 0;
    }

    function _hasUsualPrice(usualPrice) {
      return usualPrice !== undefined;
    }

    function getReviewScore(type) {
      return function (hotel) {
        var review = hotel.reviewMap[type];
        if (!review) return null;
        return review.score;
      };
    }

    function getStar(hotel) {
      return hotel.star === 0 ? undefined : hotel.star;
    }

    function getScore(hotel) {
      return hotel.score;
    }

    function getDistanceToCityCentre(hotel) {
      return hotel.distanceToCityCentre;
    }

    function getDistanceToNearestAirport(hotel) {
      return hotel.distanceToNearestAirport;
    }

    var getterMap = {
      PRICE: getPrice,
      DISCOUNT: _getDiscount,
      SAVINGS: _getSavings,
      ALL_REVIEW_SCORE: getReviewScore('ALL'),
      FAMILY_REVIEW_SCORE: getReviewScore('FAMILY'),
      BUSINESS_REVIEW_SCORE: getReviewScore('BUSINESS'),
      COUPLE_REVIEW_SCORE: getReviewScore('COUPLE'),
      SOLO_REVIEW_SCORE: getReviewScore('SOLO'),
      STAR: getStar,
      SCORE: getScore,
      DISTANCE_TO_CITY_CENTER: getDistanceToCityCentre,
      DISTANCE_TO_NEAREST_AIRPORT: getDistanceToNearestAirport,
    };

    var propertyGetter = getterMap[sort.by] || function () { };
    var cloneHotels = utils.cloneArray(hotels);

    // if provider or providerCode exists, sort in ascending with rates with provider/ providerCode first for all hotels
    if (providers.length > 0 || providerCodes.length > 0) {
      for (let cloneHotel of cloneHotels) {
        const isProviders = rate => {
          const isBookOnWego = providers.includes('wego') && rate.provider.bookingOptions.includes("BOW");
          const isHotelSite = providers.includes('hotels') && rate.provider.bookingOptions.includes("HOTEL_WEBSITE");
          const isTravelAgencySite = providers.includes('ota') && rate.provider.bookingOptions.includes("TRAVEL_AGENCY");
          return isBookOnWego || isHotelSite || isTravelAgencySite;
        }
        const isProviderCodes = rate => {
          return !!rate.providerCode ? providerCodes.indexOf(rate.providerCode) !== -1 : false;
        }
        const sortedRates = [];
        for (let rate of cloneHotel.rates) {
          if (isProviders(rate) || isProviderCodes(rate)) {
            sortedRates.unshift(rate);
          } else {
            sortedRates.push(rate);
          }
        }
        cloneHotel.rates = sortedRates;
      }
    }

    cloneHotels.sort(function (hotel1, hotel2) {

      var compareResult = utils.compare(hotel1, hotel2, propertyGetter, sort.order);
      if (compareResult == 0 && sort.by != 'PRICE') {
        return utils.compare(hotel1, hotel2, getPrice, 'ASC');
      } else {
        return compareResult;
      }
    });

    return cloneHotels;
  },
};
