var Api = {
  __host: {
    staging: {
      v3: "http://localhost:9092",
      v2: "https://srv.wegostaging.com/v2",
      v1: "https://srv.wegostaging.com"
    },
    production: {
      v3: "https://srv.wego.com/v3",
      v2: "https://srv.wego.com/v2",
      v1: "https://srv.wego.com"
    }
  },

  _hotelEndpoints: {
    hotelDetailsUrl: function (hotelId) {
      return Api.getHost("v1") + "/hotels/hotels/" + hotelId;
    }
  },

  getHost: function (version = "v2") {
    return this.__host[this.getEnvironment()][version];
  },

  setEnvironment: function (env) {
    this.env = env;
  },

  getEnvironment: function () {
    return this.env || Wego.ENV || "staging";
  },

  searchTrips: function (flightSearchEndpointUrl, requestBody, query, requestHeaders) {
    return this.post(requestBody, flightSearchEndpointUrl, query, requestHeaders);
  },

  fetchTrips: function (flightSearchEndpointUrl, searchId, query, requestHeaders) {
    let url = `${flightSearchEndpointUrl}/${searchId}/results`;
    return this.get(url, query || {}, requestHeaders);
  },

  searchHotels: function (hotelSearchEndpointUrl, requestBody, query, requestHeaders) {
    return this.post(requestBody, hotelSearchEndpointUrl, query, requestHeaders);
  },

  fetchHotels: function (hotelSearchEndpointUrl, searchId, query, requestHeaders) {
    let url = `${hotelSearchEndpointUrl}/${searchId}/results`;
    return this.get(url, query || {}, requestHeaders);
  },

  searchHotel: function (hotelDetailsEndpointUrl, requestBody, query, requestHeaders) {
    let url = `${hotelDetailsEndpointUrl}/${requestBody.search.hotelId}/searches`;
    return this.post(requestBody, url, query, requestHeaders);
  },

  fetchHotelRates: function (hotelId, query) {
    var uri = this.__host[this.getEnvironment()].v3 + "/metasearch/hotels/" + hotelId + "/rates";
    return this.get(uri, query);
  },

  fetchHotelDetails: function (hotelId, query) {
    var uri = this._hotelEndpoints.hotelDetailsUrl(hotelId);
    return this.get(uri, query);
  },

  fetchCities: function (query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/cities";
    return this.get(uri, query);
  },

  fetchAirports: function (query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/airports";
    return this.get(uri, query);
  },

  post: function (requestBody, url, query, requestHeaders) {
    return fetch(this.buildUrl(url, query), {
      method: "POST",
      credentials: "include",
      mode: 'cors',
      headers: Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' }),
      body: JSON.stringify(requestBody)
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function (e) {
      return Promise.reject(e);
    });
  },

  get: function (uri, query, requestHeaders) {
    return fetch(this.buildUrl(uri, query), {
      method: "GET",
      credentials: "include",
      mode: 'cors',
      headers: Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' })
    }).then(function (response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function (e) {
      return Promise.reject(e);
    });
  },

  buildUrl: function (uri, query) {
    if (query) {
      var arr = [];
      for (var key in query) {
        var value = query[key];
        if (value instanceof Array) {
          value.forEach(function (item) {
            arr.push(key + "[]=" + item);
          });
        } else {
          arr.push(key + "=" + query[key]);
        }
      }
      uri += "?" + arr.join("&");
    }
    return uri;
  }
};

module.exports = Api;
