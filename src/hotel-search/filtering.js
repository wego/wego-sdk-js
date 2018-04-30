var utils = require('../utils');

function filterByReviewScore(hotel, filter) {
  if (!filter.reviewScoreRange) return true;
  var review = hotel.reviewMap['ALL'] || {};
  return utils.filterByRange(review.score, filter.reviewScoreRange)
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
    if (rates[i]['usualPrice'] !== undefined) return true;
  }

  return false;
}

function filterByPrice(hotel, priceRange) {
  if (!priceRange) return true;
  return hotel.rates[0] && utils.filterByRange(hotel.rates[0].price.amountUsd, priceRange);
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
  return hotel.bedroomsCount >= count;
}

module.exports = {
  filterHotels: function (hotels, filter) {
    if (!filter) return hotels;

    var starMap = utils.arrayToMap(filter.stars);
    var districtIdMap = utils.arrayToMap(filter.districtIds);
    var cityCodeMap = utils.arrayToMap(filter.cityCodes);
    var propertyTypeIdMap = utils.arrayToMap(filter.propertyTypeIds);
    var roomTypeCategoryMap = filter.airbnb ? utils.arrayToMap(filter.airbnb.types) : null;
    var brandIdMap = utils.arrayToMap(filter.brandIds);
    var chainIdMap = utils.arrayToMap(filter.chainIds);

    return hotels.filter(function (hotel) {
      var conditionResult = filterByPrice(hotel, filter.priceRange)
        && utils.filterByKey(hotel.star, starMap)
        && filterByReviewScore(hotel, filter)
        && utils.filterByContainAllKeys(hotel.amenityIdMap, filter.amenityIds)
        && utils.filterByKey(hotel.districtId, districtIdMap)
        && utils.filterByKey(hotel.cityCode, cityCodeMap)
        && utils.filterByKey(hotel.propertyTypeId, propertyTypeIdMap)
        && utils.filterByKey(hotel.brandId, brandIdMap)
        && filterByName(hotel, filter.name)
        && utils.filterByKey(hotel.chainId, chainIdMap)
        && filterByReviewerGroups(hotel, filter.reviewerGroups)
        && filterByRateAmenities(hotel, filter.rateAmenityIds)
        && filterByDeals(hotel, filter.deals);

      if (hotel.propertyTypeId === 39) {
        return conditionResult && filterByBedroomCount(hotel, filter.airbnb.bedroomCount) && utils.filterByKey(hotel.roomTypeCategoryId, roomTypeCategoryMap);
      }
      return conditionResult;
    });
  }
};
