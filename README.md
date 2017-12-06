# Wego SDK for javascript
The official Wego SDK for JavaScript, available for browsers and mobile devices (if you are using javascript), or Node.js backends

## Installing
### Bower
```
bower install wego-sdk
```
### NPM
```
npm install wego-sdk
```

## Usage
### Flight Search Client
Create client
```
var client = new WegoSdk.FlightSearchClient({
  onTotalTripsChanged: function(trips) {
    // Do something with trips
  },
  onTripsChanged: function(trips) {
    // Do something with trips
  },
  onDisplayedFilterChanged: function(filter) {
    // Do something with filter
  },
  onProgressChanged: function(progress) {
    // Do something with progress
  },
  onCheapestTripChanged: function(trip) {
   // Do something with trip
  },
  onFastestTripChanged: function(trip) {
    // Do something with trip
  },
  onBestExperienceTripChanged: function(trip) {
    // Do something with trip
  },
  onSearchCreated: function(newSearch) {
    // Do something with newSearch
  }
});
```
Make a new search
```
client.searchTrips(search);
```
### Hotel SDK Client
Create client
```
var client = new WegoSdk.HotelSearchClient({
  onTotalHotelsChanged: function(hotels) {
    // Do something with hotels
  },
  onHotelsChanged: function(hotels) {
    // Do something with hotels
  },
  onDisplayedFilterChanged: function(filter) {
    // Do something with filter
  },
  onProgressChanged: function(progress) {
    // Do something with progress
  },
  onSearchCreated: function(newSearch) {
    // Do something with newSearch
  }
});
```
Make a new search ([More Info](https://github.com/wego/wego-api-docs#create-new-hotels-search))
```
// valid search object
var searchParams = {
  "search": {
    "id": "2d8805fd14337580",
    "siteCode": "SG",
    "locale": "en",
    "currencyCode": "SGD",
    "cityCode": "SIN",
    "countryCode": "SG",
    "roomsCount": 1,
    "guestsCount": 2,
    "checkIn": "2017-12-11",
    "checkOut": "2017-12-16",
    "deviceType": "DESKTOP",
    "appType": "WEB_APP",
    "userLoggedIn": true
    "hotelId": "12345", // optional
    "districtId": "12345" // optional
  },
  "offset": 500,
  "selectedHotelIds": ['258101'] // optional
}

client.searchHotels(searchParams);
```
### Hotel Details Rates SDK Client
Create client
```
var client = new WegoSdk.HotelDetailsClient({
  onHotelRatesChanged: function(rates) {
    // Do something with rates
  },
  onProgressChanged: function(progress) {
    // Do something with progress
  },
  onSearchCreated: function(newSearch) {
    // Do something with newSearch
  }
});
```
Make a new search
```
client.searchHotelRates(hotelSearch, mainSearchId);
```

### Test
```
npm run test
```

### Commit
Need to update and commit bower.bundle.js and npm.bundle.js files
```
npm run build
```
