var utils = require('../utils');

function filterByReviewScore(hotel, filter) {
  if (!filter.reviewScoreRange) return true;
  var review  = hotel.reviewMap['ALL'] || {};
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

function filterByPrice(hotel, priceRange) {
  if (!priceRange) return true;
  return hotel.rates[0] && utils.filterByRange(hotel.rates[0].price.amountUsd, priceRange);
}

function filterByName(hotel, name) {
  if (!name) return true;
  // check with name from previous logic
  if (utils.filterByTextMatching(hotel.name, name)) return true;
  // check if match with any translation names
  for (var locale in hotel.nameTranslations) {
    if (utils.filterByTextMatching(hotel.nameTranslations[locale], name)) return true;
  }
  return false; // cannot found
}

module.exports = {
  filterHotels: function(hotels, filter) {
    if (!filter) return hotels;

    var starMap = utils.arrayToMap(filter.stars);
    var districtIdMap = utils.arrayToMap(filter.districtIds);
    var propertyTypeIdMap = utils.arrayToMap(filter.propertyTypeIds);
    var brandIdMap = utils.arrayToMap(filter.brandIds);
    var chainIdMap = utils.arrayToMap(filter.chainIds);

    return hotels.filter(function(hotel) {
      return filterByPrice(hotel, filter.priceRange)
        && utils.filterByKey(hotel.star, starMap)
        && filterByReviewScore(hotel, filter)
        && utils.filterByContainAllKeys(hotel.amenityIdMap, filter.amenityIds)
        && utils.filterByKey(hotel.districtId, districtIdMap)
        && utils.filterByKey(hotel.propertyTypeId, propertyTypeIdMap)
        && utils.filterByKey(hotel.brandId, brandIdMap)
        && filterByName(hotel, filter.name)
        && utils.filterByKey(hotel.chainId, chainIdMap)
        && filterByReviewerGroups(hotel, filter.reviewerGroups)
        && filterByRateAmenities(hotel, filter.rateAmenityIds);
    });
  }
};