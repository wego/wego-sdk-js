var utils = require('../utils');

module.exports = {
  sortHotels: function (hotels, sort, filter = {}) {
    if (!sort) return hotels;

    const { providers = [], providerCodes = [], rateAmenityIds = [] } = filter;

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

    const filteredRates = (hotel, providers = [], providerCodes = [], rateAmenityIds = []) => {
      let rates = hotel.rates || [];

      // if provider exists
      if (providers.length > 0) {
        rates = rates.filter(rate => {
          const isBookOnWego = providers.indexOf('wego') !== -1 && rate.provider.directBooking;
          const isHotelSite = providers.indexOf('hotels') !== -1 && rate.provider.isHotelWebsite;
          const isTravelAgencySite = providers.indexOf('ota') !== -1 && rate.provider.type === 'OTA';
          return isBookOnWego || isHotelSite || isTravelAgencySite;
        });
      }

      // if provider code exists
      if (providerCodes.length > 0) {
        rates = rates.filter(rate => {
          return !!rate.providerCode ? providerCodes.indexOf(rate.providerCode) !== -1 : false;
        });
      }

      // if rate amenity id exists
      if (rateAmenityIds.length > 0) {
        rates = rates.filter(rate => {
          for (let j = 0; j < rateAmenityIds.length; j++) {
            if (rate.rateAmenityIds.includes(parseInt(rateAmenityIds[j]))) {
              return true;
            }
          }
          return false;
        });
      }

      return rates;
    };

    cloneHotels.sort(function (hotel1, hotel2) {
      // if provider or provider code or rate amenity id exists
      if (providers.length > 0 || providerCodes.length > 0 || rateAmenityIds.length > 0) {
        const hotel1Rate = filteredRates(hotel1, providers, providerCodes, rateAmenityIds)[0];
        const hotel2Rate = filteredRates(hotel2, providers, providerCodes, rateAmenityIds)[0];
        if (hotel1Rate && hotel2Rate) {
          if (hotel1Rate.price.amountUsd > hotel2Rate.price.amountUsd) {
            return sort.order === "ASC" ? 1 : -1;
          } else if (hotel1Rate.price.amountUsd < hotel2Rate.price.amountUsd) {
            return sort.order === "ASC" ? -1 : 1;
          } else {
            return 0;
          }
        }
        return 0;
      } else {
        var compareResult = utils.compare(hotel1, hotel2, propertyGetter, sort.order);
        if (compareResult == 0 && sort.by != 'PRICE') {
          return utils.compare(hotel1, hotel2, getPrice, 'ASC');
        } else {
          return compareResult;
        }
      }
    });

    return cloneHotels;
  },
};
