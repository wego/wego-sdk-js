const Api = require("./Api");
const FlightSearchClient = require("./flight-search/FlightSearchClient");
const HotelSearchClient = require("./hotel-search/HotelSearchClient");
const HotelDetailsClient = require("./hotel-details/HotelDetailsClient");

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelDetailsClient: HotelDetailsClient
};
