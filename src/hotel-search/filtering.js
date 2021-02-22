var utils = require('../utils');

function filterByReviewScore(hotel, reviewScoreRange) {
  if (!reviewScoreRange) return true;
  var review = hotel.reviewMap['ALL'] || {};
  return utils.filterByRange(review.score, reviewScoreRange);
}

function filterByReviewerGroups(hotel, reviewerGroups) {
  if (!reviewerGroups || reviewerGroups.length === 0) return true;
  for (var i = 0; i < reviewerGroups.length; i++) {
    var review = hotel.reviewMap[reviewerGroups[i]];
    if (review && review.score >= 80 && review.count >= 100) {
      return true;
    }
  }
  return false;
}

function filterByRateAmenities(hotel, rateAmenityIds) {
  if (!rateAmenityIds || rateAmenityIds.length === 0) return true;
  var rates = hotel.rates;

  if (!rates) return false;

  for (var i = 0; i < rates.length; i++) {
    for (var j = 0; j < rateAmenityIds.length; j++) {
      if (rates[i].rateAmenityIds.includes(parseInt(rateAmenityIds[j]))) return true;
    }
  }

  return false;
}

function filterByDeals(hotel, deals) {
  if (!deals || deals.length === 0) return true;
  var rates = hotel.rates;
  if (!rates) return false;

  for (var i = 0; i < rates.length; i++) {
    var rate = rates[i];

    if (rate.usualPrice !== undefined || (rate.promos && rate.promos.length > 0)) return true;
  }

  return false;
}

function filterByPrice(hotel = {}, filter = {}) {

  const { providers = [], providerCodes = [], rateAmenityIds = [], priceRange } = filter;

  if (!priceRange) {
    return true;
  }

  let filteredRates = hotel.rates || [];

  // if provider exists
  if (providers.length > 0) {
    filteredRates = filteredRates.filter(rate => {
      const isBookOnWego = providers.indexOf('wego') !== -1 && rate.provider.directBooking;
      const isHotelSite = providers.indexOf('hotels') !== -1 && rate.provider.isHotelWebsite;
      const isTravelAgencySite = providers.indexOf('ota') !== -1 && rate.provider.type === 'OTA';
      return isBookOnWego || isHotelSite || isTravelAgencySite;
    });
  }

  // if provider code exists
  if (providerCodes.length > 0) {
    filteredRates = filteredRates.filter(rate => providerCodes.includes(rate.providerCode));
  }

  // if rate amenity id exists
  if (rateAmenityIds.length > 0) {
    filteredRates = filteredRates.filter(rate => {
      for (let j = 0; j < rateAmenityIds.length; j++) {
        if (rate.rateAmenityIds.includes(parseInt(rateAmenityIds[j]))) {
          return true;
        }
      }
      return false;
    });

  }

  if (filteredRates.length > 0) {
    return utils.filterByRange(filteredRates[0].price.amountUsd, priceRange);
  }

  return false;
}

function filterByName(hotel, name) {
  if (!name) return true;
  if (utils.filterByTextMatching(hotel.name, name)) return true;
  if (!hotel.nameI18n) return false;
  for (var locale in hotel.nameI18n) {
    if (utils.filterByTextMatching(hotel.nameI18n[locale], name)) return true;
  }
  return false;
}

function filterByBedroomCount(hotel, count) {
  return count > 0 ? hotel.bedroomsCount >= count : true;
}

function filterByProviders(hotel, providerCodes = []) {
  if (providerCodes.length === 0) {
    return true;
  }

  return (hotel.rates || []).some(rate => providerCodes.includes(rate.providerCode));
}

function filterByProviderTypes(hotel, providers = []) {
  // providers = wego, hotels, ota
  if (providers.length === 0) {
    return true;
  }

  return (hotel.rates || []).some(rate => {
    const isBookOnWego = providers.indexOf('wego') !== -1 && rate.provider.directBooking;
    const isHotelSite = providers.indexOf('hotels') !== -1 && rate.provider.isHotelWebsite;
    const isTravelAgencySite = providers.indexOf('ota') !== -1 && rate.provider.type === 'OTA';
    return isBookOnWego || isHotelSite || isTravelAgencySite;
  });
}

module.exports = {
  filterHotels: function (hotels, filter) {
    if (!filter) return hotels;

    var starMap = utils.arrayToMap(filter.stars);
    var districtIdMap = utils.arrayToMap(filter.districtIds);
    var cityCodeMap = utils.arrayToMap(filter.cityCodes);
    var propertyTypeIdMap = utils.arrayToMap(filter.propertyTypeIds);
    var roomTypeCategoryMap = utils.arrayToMap(filter.airbnbTypes);
    var brandIdMap = utils.arrayToMap(filter.brandIds);
    var chainIdMap = utils.arrayToMap(filter.chainIds);

    return hotels.filter(function (hotel) {
      var conditionResult =
        filterByPrice(hotel, filter) &&
        utils.filterByKey(hotel.star, starMap) &&
        utils.filterByContainAllKeys(hotel.amenityIdMap, filter.amenityIds) &&
        utils.filterByKey(hotel.districtId, districtIdMap) &&
        utils.filterByKey(hotel.cityCode, cityCodeMap) &&
        utils.filterByKey(hotel.propertyTypeId, propertyTypeIdMap) &&
        utils.filterByKey(hotel.brandId, brandIdMap) &&
        filterByName(hotel, filter.name) &&
        utils.filterByKey(hotel.chainId, chainIdMap) &&
        filterByReviewerGroups(hotel, filter.reviewerGroups) &&
        filterByRateAmenities(hotel, filter.rateAmenityIds) &&
        filterByProviders(hotel, filter.providerCodes) &&
        filterByProviderTypes(hotel, filter.providers) &&
        filterByDeals(hotel, filter.deals) &&
        filterByReviewScore(hotel, filter.reviewScoreRange);

      if (hotel.propertyTypeId === 39) {
        return (
          conditionResult &&
          filterByBedroomCount(hotel, filter.airbnbBedroomCount ? filter.airbnbBedroomCount : 0) &&
          utils.filterByKey(hotel.roomTypeCategoryId, roomTypeCategoryMap)
        );
      }
      return conditionResult;
    });
  }
};
