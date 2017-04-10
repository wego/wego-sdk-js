module.exports = {
  filterHotels: function(hotels, filter) {
    if (!filter) return hotels;

    function filterByKey(key, filterMap) {
      return !filterMap || filterMap[key];
    }

    function filterByArrayContainAll(map, filterArray) {
      if (!filterArray) return true;
      var containAll = true;
      filterArray.forEach(function(element) {
        if (!map[element]) containAll = false;
      });
      return containAll;
    }

    function filterByRange(value, range) {
      if (!range) return true;
      return range.min <= value && value <= range.max;
    }

    function filterByContainText(text, filterText) {
      if (!filterText) return true;
      return text.indexOf(filterText) > -1;
    }

    function filterByReviewScore(hotel, filter) {
      if (!filter.reviewScoreRange) return true;
      var review  = hotel.reviewMap['ALL'] || {};
      return filterByRange(review.score, filter.reviewScoreRange)
    }

    function filterByReviewerGroups(hotel, reviewerGroups) {
      if (!reviewerGroups) return true;
      for (var i = 0; i < reviewerGroups.length; i++) {
        var review = hotel.reviewMap[reviewerGroups[i]];
        if (review && review.score >= 80) {
          return true;
        }
      }
      return false;
    }

    function filterByPrice(hotel, priceRange) {
      if (!priceRange) return true;
      return hotel.rates[0] && filterByRange(hotel.rates[0].price.amountUsd, priceRange);
    }

    function arrayToMap(items) {
      if (!items) return null;
      var map = {};
      items.forEach(function(item) {
        map[item] = true;
      });
      return map;
    }

    var starMap = arrayToMap(filter.stars);
    var districtIdMap = arrayToMap(filter.districtIds);
    var propertyTypeIdMap = arrayToMap(filter.propertyTypeIds);
    var brandIdMap = arrayToMap(filter.brandIds);
    var chainIdMap = arrayToMap(filter.chainIds);

    return hotels.filter(function(hotel) {
      return filterByPrice(hotel, filter.priceRange)
        && filterByKey(hotel.star, starMap)
        && filterByReviewScore(hotel, filter)
        && filterByArrayContainAll(hotel.amenityIdMap, filter.amenityIds)
        && filterByKey(hotel.districtId, districtIdMap)
        && filterByKey(hotel.propertyTypeId, propertyTypeIdMap)
        && filterByKey(hotel.brandId, brandIdMap)
        && filterByContainText(hotel.name, filter.name)
        && filterByKey(hotel.chainId, chainIdMap)
        && filterByReviewerGroups(hotel, filter.reviewerGroups);
    });
  }
};