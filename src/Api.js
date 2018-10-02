var Api = {
  __host: {
    staging: {
      v3: "https://srv.wegostaging.com/v3",
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
    searchSingleHotelUrl: function(hotelId) {
      var path = "/metasearch/hotels/" + hotelId + "/searches";
      return Api.getHost("v3") + path;
    },
    hotelDetailsUrl: function (hotelId) {
      return Api.getHost("v1") + "/hotels/hotels/" + hotelId;
    }
  },

  _flightEndpoints: {
    searchTrips: function () {
      var path = "/metasearch/flights/searches";
      return Api.getHost("v3") + path;
    },
    fetchTrips: function (searchId) {
      var path = "/metasearch/flights/searches/" + searchId + "/results";
      return Api.getHost("v3") + path;
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

  searchTrips: function (requestBody, query) {
    var uri = this._flightEndpoints.searchTrips();
    return this.post(requestBody, uri, query);
  },

  fetchTrips: function (searchId, query = {}) {
    var uri = this._flightEndpoints.fetchTrips(searchId);
    return this.get(uri, query);
  },

  searchHotels: function (searchHotelsEndpointUrl, requestBody, query, requestHeaders) {
    return this.post(requestBody, searchHotelsEndpointUrl, query, requestHeaders);
  },

  fetchHotels: function (searchHotelsEndpointUrl, searchId, query, requestHeaders) {
    let self = this;
    let url = `${searchHotelsEndpointUrl}/${searchId}/results`;
    return self.get(url, query || {}, requestHeaders);
  },

  searchHotel: function (requestBody, query) {
    var hotelId = requestBody.search.hotelId,
      uri = this._hotelEndpoints.searchSingleHotelUrl(hotelId);
    return this.post(requestBody, uri, query);
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
      headers: new Headers(Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' })),
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
      headers: new Headers(Object.assign({}, requestHeaders, { 'Content-Type': 'application/json' }))
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
