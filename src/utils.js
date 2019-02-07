var utils = {
  cloneObject: function(obj) {
    var clonedObj = {};
    for (var key in obj) {
      clonedObj[key] = obj[key];
    }
    return clonedObj;
  },

  cloneArray: function(arr) {
    var clonedArr = [];
    arr.forEach(function(item) {
      clonedArr.push(item);
    });
    return clonedArr;
  },

  // Get array of values from map
  mapValues: function(obj) {
    return Object.keys(obj).map(function(key) {
      return obj[key];
    });
  },

  compare: function(item1, item2, propertyGetter, order) {
    var val1 = propertyGetter(item1);
    var val2 = propertyGetter(item2);
    if (val1 === val2) return 0;
    if (val1 === null || val1 === undefined) return 1;
    if (val2 === null || val2 === undefined) return -1;
    return (val1 > val2) === (order === 'ASC') ? 1 : -1;
  },

  filterByKey: function(key, filterMap) {
    return !filterMap || filterMap[key];
  },

  filterByAllKeys: function(keys, filterMap) {
    if (!filterMap) return true;
    if (keys.length === 0) return false;

    for (var i = 0; i < keys.length; i++) {
      if (!filterMap[keys[i]]) return false;
    }
    return true;
  },

  filterBySomeKeys: function(map, filterKeys) {
    if (!filterKeys || filterKeys.length === 0) return true;
    for (var i = 0; i < filterKeys.length; i++) {
      if (map[filterKeys[i]]) return true;
    }
    return false;
  },

  filterByContainAllKeys: function(keyMap, filterKeys) {
    if (!filterKeys) return true;
    for (var i = 0; i < filterKeys.length; i++) {
      if (!keyMap[filterKeys[i]]) return false;
    }
    return true;
  },

  filterByTextMatching: function(text, query) {
    if (!query) return true;
    return this.stripAccents(text).toLowerCase().indexOf(this.stripAccents(query).toLowerCase()) > -1;
  },

  // Filter by range, min/max undefined means unset
  // value: 10  range: {min: 8, max: undefined}  = true
  filterByRange: function(value, range) {
    if (!range) return true;
    var undef, min = range.min === undef ? 0 : range.min;
    var max = range.max === undef ? (1 << 30) : range.max;
    return min <= value && value <= max;
  },

  arrayToMap: function(items) {
    if (!items || items.length === 0) return null;
    var map = {};
    items.forEach(function(item) {
      map[item] = true;
    });
    return map;
  },

  arrayToMaps: function(items, multiCity) {
    if( !multiCity ) return this.arrayToMap(items);
    if (!items || items.length === 0) return null;
    var map = {};
    items.forEach(function(item) {
      var legPrefix = item[0]-1, code = item.substr(2);
      map[legPrefix] = map[legPrefix] || {};
      map[legPrefix][code] = true;
    });
    return map;
  },

  stripAccents: (function () {
    var inChars = 'àáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ';
    var outChars = 'aaaaaceeeeiiiinooooouuuuyyAAAAACEEEEIIIINOOOOOUUUUY';
    var charsRgx = new RegExp('[' + inChars + ']', 'g');
    var dictionary = {};

    function lookup(key) {
      return dictionary[key] || key;
    }

    for (var i = 0; i < inChars.length; i++) {
      dictionary[inChars[i]] = outChars[i];
    }

    return function (text) {
      return !!text ? text.replace(charsRgx, lookup) : "";
    }
  })(),
};

module.exports = utils;
