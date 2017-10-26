var Api = require("./Api");
var FlightSearchClient = require("./flight-search/Client");
var HotelSearchClient = require("./hotel-search/Client");
var HotelDetailsClient = require("./hotel-details/Client");
var FlightSorting = require('./flight-search/sorting');
var FlightFiltering = require('./flight-search/filtering');

module.exports = {
    Api: Api,
    FlightSearchClient: FlightSearchClient,
    FlightSorting: FlightSorting,
    FlightFiltering: FlightFiltering,
    HotelSearchClient: HotelSearchClient,
    HotelDetailsClient: HotelDetailsClient
};