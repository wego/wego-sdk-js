const Api = require("./Api");
const FlightSearchClient = require("./flight-search/Client");
const HotelSearchClient = require("./hotel-search/HotelSearchClient");
const HotelDetailsClient = require("./hotel-details/HotelDetailsClient");

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelDetailsClient: HotelDetailsClient
};
