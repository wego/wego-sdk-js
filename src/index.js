var Api = require("./Api");
var FlightSearchClient = require('./flight-search/Client');
var HotelSearchClient = require('./hotel-search/Client');
var HotelDetailsClient = require('./hotel-details/Client');

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelDetailsClient: HotelDetailsClient,
};
