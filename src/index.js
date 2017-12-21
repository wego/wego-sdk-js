var Api = require("./Api");
var FlightSearchClient = require("./flight-search/Client");
var HotelSearchClient = require("./hotel-search/Client");
var HotelDetailsClient = require("./hotel-details/Client");
var UsersServiceClient = require("./users-service/Client");

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelDetailsClient: HotelDetailsClient,
  UsersServiceClient: UsersServiceClient
};
