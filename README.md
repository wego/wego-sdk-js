<div align="center" style="text-align: center;">
  <h1 style="border-bottom: none;">Wego SDK</h1>

  <p>Wego SDK for JavaScript</p>
</div>

<hr />


[![Version][version-badge]][version-url]

[![Downloads][downloads-badge]][downloads-url]
[![Total downloads][total-downloads-badge]][downloads-url]
[![Packagephobia][packagephobia-badge]][packagephobia-url]
[![Bundlephobia][bundlephobia-badge]][bundlephobia-url]

[![Build Status][travis-badge]][travis-url]

The official Wego SDK for JavaScript, available for browsers and mobile devices (if you are using JavaScript), or [Node.js][nodejs-url] backends

## Installation

### Bower

```sh
$ bower install wego-sdk
```

### NPM

```sh
$ npm install wego-sdk
```

## Usage

### Flight Search Client

```js
/** Create `FlighSearchClient` */
const client = new WegoSdk.FlightSearchClient({
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

/** Make a new search for trips */
client.searchTrips(search);
```

### List of Flight Filters

1. Stops

    ```js
    stopCodes: [
      'DIRECT',
      'ONE_STOP',
      'MORE_THAN_ONE_STOP',
    ],
    ```

2. Price

    ```js
    priceRange: {
      'legIndex': undefined,
      'min': 1397,
      'max': 10924,
    },
    ```

3. Fare Types
   
    ```js
    conditions: [
      'refundable',
      'non_refundable',
      'scheduled',
      'chartered',
    ],
    ```

4. Flight Times

    ```js
    departureTimeMinutesRanges: [
      {
        'min': 171,
        'max': 1241,
        'legIndex': 0,
      },
      {
        'min': 360,
        'max': 1296,
        'legIndex': 1,
      }
    ];
    ```

    ```js
    arrivalTimeMinutesRanges: [
      {
        'min': 171,
        'max': 1241,
        'legIndex': 0,
      },
      {
        'min': 360,
        'max': 1296,
        'legIndex': 1,
      }
    ];
    ```

5. Airlines/Alliances

    ```js
    airlineCodes: [
      'AF',
      'NH',
    ],
    allianceCodes: [
      'sky_team',
      'star_alliance',
      'oneworld',
      'lcc',
    ],
    /** Complete trip on the same airline */
    tripOptions: ['SAME_AIRLINE'],
    ```

6. Booking Options

    ```js
    providerTypes: [
      'instant',
      'airline',
    ],
    ```

7. Origin/Destination

    ```js
    originAirportCodes: ['SIN'],
    destinationAirportCodes: ['IAD'],
    ```

8. Stopover Airports

    ```js
    stopoverAirportCodes: ['BRU', 'PEK'],
    ```

9. Duration

    ```js
    durationMinutesRanges: [
      {
        'min': 1553,
        'max': 3113,
        'legIndex': 0,
      },
      {
        'min': 1564,
        'max': 3379,
        'legIndex': 1,
      },
    ],
    stopoverDurationMinutesRanges: [
      {
        'min': 190,
        'max': 2275,
        'legIndex': undefined,
      },
    ],
    ```

10. Flight Experience

    ```js
    itineraryOptions: [
      'NOT_OVERNIGHT',
      'SHORT_STOPOVER',
    ],
    ```

### Hotel SDK Client

```js
/** Create `HotelSearchClient` */
const client = new WegoSdk.HotelSearchClient({
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

/**
 * Make a new search by calling `searchHotels`.
 * 
 * For more info about the `searchParams`, please visit 
 * https://github.com/wego/wego-api-docs#create-new-hotels-search.
 */
const searchParams = {
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
    "hotelId": "12345", /** Optional */
    "districtId": "12345" /** Optional */
  },
  "offset": 500,
  "selectedHotelIds": ['258101'], /** Optional */

  similarHotels: { limit: 10 }, /** New, optional */
}

client.searchHotels(searchParams);
```

### Hotel Details Rates SDK Client

```js
/** Create `HotelDetailsClient` */
const client = new WegoSdk.HotelDetailsClient({
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

/** Create new search */
client.searchHotelRates(hotelSearch, mainSearchId);
```

### Test

```sh
$ npm run test
```

### Commit

The final bundle will be output at `dist` directory named `WegoSdk.js`.

```sh
$ npm run build
```

## References

[Wego API documentation][wego-api-documentation-url]

## License

ISC

<!-- References -->
[nodejs-url]: https://nodejs.org
[npm-url]: https://www.npmjs.com
[wego-api-documentation-url]: https://github.com/wego/wego-docs


<!-- MDN -->
[map-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map
[string-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String
[object-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object
[number-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number
[boolean-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean
[html-style-element-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/API/HTMLStyleElement
[promise-mdn-url]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise

<!-- Badges -->
[version-badge]: https://flat.badgen.net/npm/v/wego-sdk

[downloads-badge]: https://flat.badgen.net/npm/dm/wego-sdk
[total-downloads-badge]: https://flat.badgen.net/npm/dt/wego-sdk?label=total%20downloads
[packagephobia-badge]: https://flat.badgen.net/packagephobia/install/wego-sdk
[bundlephobia-badge]: https://flat.badgen.net/bundlephobia/minzip/wego-sdk

[travis-badge]: https://flat.badgen.net/travis/wego/wego-sdk-js

<!-- Links -->
[version-url]: https://www.npmjs.com/package/wego-sdk

[downloads-url]: http://www.npmtrends.com/wego-sdk
[packagephobia-url]: https://packagephobia.now.sh/result?p=wego-sdk
[bundlephobia-url]: https://bundlephobia.com/result?p=wego-sdk

[travis-url]: https://travis-ci.org/wego/wego-sdk
