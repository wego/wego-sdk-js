var Api = {
  __host: {
    staging: {
      v2: "https://srv.wegostaging.com/v2",
      v1: "https://srv.wegostaging.com"
    },
    production: {
      v2: "https://srv.wego.com/v2",
      v1: "https://srv.wego.com"
    }
  },

  hotelEndoints: {
    searchHotelsUrl: function() {
      return Api.getHost("v2") + "/metasearch/hotels/searches";
    },
    fetchHotelsUrl: function(searchId) {
      return (
        Api.getHost("v2") +
        "/metasearch/hotels/searches/" +
        searchId +
        "/results"
      );
    },
    searchSingleHotelUrl: function(hotelId) {
      var path = "/metasearch/hotels/" + hotelId + "/searches";
      return Api.getHost("v2") + path;
    },
    hotelDetailsUrl: function(hotelId) {
      return Api.getHost("v1") + "/hotels/hotels/" + hotelId;
    }
  },

  getHost: function(version = "v2") {
    return this.__host[this.getEnvironment()][version];
  },

  setEnvironment: function(env) {
    this.env = env;
  },

  getEnvironment: function() {
    return this.env || "staging";
  },

  searchTrips: function(requestBody, query) {
    var uri =
      this.__host[this.getEnvironment()].v2 + "/metasearch/flights/searches";
    return this.post(requestBody, uri, query);
  },

  searchHotels: function(requestBody, query) {
    var uri = this.hotelEndoints.searchHotelsUrl();
    return this.post(requestBody, uri, query);
  },

  fetchHotels: function(searchId, query = {}) {
    var uri = this.hotelEndoints.fetchHotelsUrl(searchId);
    return this.get(uri, query);
  },

  searchHotel: function(requestBody, query) {
    var hotelId = requestBody.search.hotelId,
      uri = this.hotelEndoints.searchSingleHotelUrl(hotelId);
    return this.post(requestBody, uri, query);
  },

  fetchHotelDetails: function(hotelId, query) {
    var uri = this.hotelEndoints.hotelDetailsUrl(hotelId);
    return this.get(uri, query);
  },

  fetchCities: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/cities";
    return this.get(uri, query);
  },

  fetchAirports: function(query) {
    var uri = this.__host[this.getEnvironment()].v1 + "/places/airports";
    return this.get(uri, query);
  },

  post: function(requestBody, uri, query) {
    return fetch(this.buildUrl(uri, query), {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject();
        }
      })
      .catch(function(e) {
        return Promise.reject(e);
      });
  },

  get: function(uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then(function(response) {
        if (response.ok) {
          return response.json();
        } else {
          return Promise.reject();
        }
      })
      .catch(function(e) {
        return Promise.reject(e);
      });
  },

  buildUrl: function(uri, query) {
    if (query) {
      var arr = [];
      for (var key in query) {
        var value = query[key];
        if (value instanceof Array) {
          value.forEach(function(item) {
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
