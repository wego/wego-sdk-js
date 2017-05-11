var Api = {
  __host: {
    staging: {
      metasearch: 'https://srv.wegostaging.com',
      place: 'https://srv.wego.com'
    },
    production: {
      metasearch: 'https://srv.wego.com',
      place: 'https://srv.wego.com'
    }
  },

  setEnvironment: function(env) {
    this.env = env;
  },

  getEnvironment: function() {
    return this.env || 'staging';
  },

  searchTrips: function(requestBody, query) {
    var uri = this.__host[this.getEnvironment()].metasearch + '/metasearch/flights/searches';
    return this.post(requestBody, uri, query);
  },

  searchHotels: function(requestBody, query) {
    var uri = this.__host[this.getEnvironment()].metasearch + '/metasearch/hotels/searches';
    return this.post(requestBody, uri, query);
  },

  fetchCities: function(query) {
    var uri = this.__host[this.getEnvironment()].place + '/places/cities';
    return this.get(uri, query);
  },

  fetchAirports: function(query) {
    var uri = this.__host[this.getEnvironment()].place + '/places/airports';
    return this.get(uri, query);
  },

  post: function(requestBody, uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function(e) {
      return Promise.reject(e);
    });
  },

  get: function(uri, query) {
    return fetch(this.buildUrl(uri, query), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
    }).then(function(response) {
      if (response.ok) {
        return response.json();
      } else {
        return Promise.reject();
      }
    }).catch(function(e) {
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
            arr.push(key + '[]=' + item);
          });
        } else {
          arr.push(key + '=' + query[key]);
        }
      }
      uri += '?' + arr.join('&');
    }
    return uri;
  }
};

module.exports = Api;