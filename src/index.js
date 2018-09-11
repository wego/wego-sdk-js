const Api = require("./Api");
const FlightSearchClient = require("./flight-search/Client");
const HotelSearchClient = require("./hotel-search/Client");
const HotelSearchClientV2 = require("./hotel-search/HotelSearchClient");
const HotelDetailsClient = require("./hotel-details/Client");

module.exports = {
  Api: Api,
  FlightSearchClient: FlightSearchClient,
  HotelSearchClient: HotelSearchClient,
  HotelSearchClientV2: HotelSearchClientV2,
  HotelDetailsClient: HotelDetailsClient
};
