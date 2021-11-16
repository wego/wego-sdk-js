var filtering = require('../../src/hotel-search/filtering');

describe('wego-hotel-filtering-behavior_test', function () {
  describe('#filterHotels', function () {
    it('filtering by star', function () {
      var hotel1 = createHotel({
        star: 1,
      });

      var hotel2 = createHotel({
        star: 2,
      });

      var hotel3 = createHotel({
        star: 3,
      });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        stars: [1, 3]
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filters by deals', function () {
      var hotel1 = createHotelWithDeals(100, 0.15);
      var hotel2 = createHotel();
      var hotel3 = createHotelWithDeals(200, 0.20);
      var hotel4 = createHotel();

      expect(filtering.filterHotels([hotel1, hotel2, hotel3, hotel4], {
        deals: 'today'
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by review score', function () {
      var hotel1 = createHotelWithReviewScore(7);
      var hotel2 = createHotelWithReviewScore(5);
      var hotel3 = createHotelWithReviewScore(6);
      var hotel4 = createHotelWithReviewScore(8);

      expect(filtering.filterHotels([hotel1, hotel2, hotel3, hotel4], {
        reviewScoreRange: {
          min: 6,
          max: 7,
        }
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by amenities', function () {
      var hotel1 = createHotel({
        amenityIdMap: {
          1: true,
          4: true,
          2: true,
        }
      });

      var hotel2 = createHotel({
        amenityIdMap: {
          1: true,
          4: true,
          5: true,
        }
      });

      var hotel3 = createHotel({
        amenityIdMap: {
          1: true,
          6: true,
        }
      });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        amenityIds: [1, 4]
      })).to.deep.equal([hotel1, hotel2]);
    });

    it('filtering by districts', function () {
      var hotel1 = createHotel({ districtId: 1 });
      var hotel2 = createHotel({ districtId: 2 });
      var hotel3 = createHotel({ districtId: 3 });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        districtIds: [1, 3]
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by propertyTypes', function () {
      var hotel1 = createHotel({ propertyTypeId: 1 });
      var hotel2 = createHotel({ propertyTypeId: 2 });
      var hotel3 = createHotel({ propertyTypeId: 3 });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        propertyTypeIds: [1, 3]
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by brands', function () {
      var hotel1 = createHotel({ brandId: 1 });
      var hotel2 = createHotel({ brandId: 2 });
      var hotel3 = createHotel({ brandId: 3 });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        brandIds: [1, 3]
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by name', function () {
      var hotel1 = createHotel({ name: 'wEgo' });
      var hotel2 = createHotel({ name: 'weho', nameI18n: { en: "weho", ar: "wehoxx" } });
      var hotel3 = createHotel({ name: 'legh', nameI18n: { en: "legh", ar: "leghx" } });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        name: 'eg'
      })).to.deep.equal([hotel1, hotel3]);
      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        name: 'xx'
      })).to.deep.equal([hotel2]);
    });

    it('filtering by chainIdMap', function () {
      var hotel1 = createHotel({ chainId: 1 });
      var hotel2 = createHotel({ chainId: 2 });
      var hotel3 = createHotel({ chainId: 3 });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        chainIds: [1, 3],
      })).to.deep.equal([hotel1, hotel3]);
    });

    it('filtering by recommended Reviewer', function () {
      var hotel1 = createHotel({
        reviewMap: {
          FAMILY: {
            score: 90,
            count: 200
          }
        }
      });
      var hotel2 = createHotel({
        reviewMap: {
          BUSINESS: {
            score: 90,
            count: 90
          }
        }
      });
      var hotel3 = createHotel({
        reviewMap: {
          FAMILY: {
            score: 70,
            count: 200
          },
          BUSINESS: {
            score: 70,
            count: 200
          },
        },
      });

      expect(filtering.filterHotels([hotel1, hotel2, hotel3], {
        reviewerGroups: ['FAMILY', 'BUSINESS'],
      })).to.deep.equal([hotel1]);
    });

    it('priceRange', function () {
      var filter = {
        priceRange: {
          min: 5,
          max: 10,
        }
      };

      var hotel1 = {
        rates: [createRateWithAmountUsd(4)]
      };

      var hotel2 = {
        rates: [createRateWithAmountUsd(5)]
      };

      var hotel3 = {
        rates: [createRateWithAmountUsd(6)]
      };

      var hotel4 = {
        rates: [createRateWithAmountUsd(10)]
      };

      var hotel5 = {
        rates: [createRateWithAmountUsd(12)]
      };

      var hotels = filtering.filterHotels([hotel1, hotel2, hotel3, hotel4, hotel5], filter);

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel4]);
    });

    it('filtering by rate amenities', function () {
      var filter = {
        rateAmenityIds: [1, 2]
      };

      var hotel1 = {
        rates: [createRateWithRateAmenities([1, 2])]
      };

      var hotel2 = {
        rates: [createRateWithRateAmenities([3, 2])]
      };

      var hotel3 = {
        rates: [createRateWithRateAmenities([3, 4])]
      };

      var hotels = filtering.filterHotels([hotel1, hotel2, hotel3], filter);

      expect(hotels).to.deep.equal([hotel1, hotel2]);
    });

    it('filtering by providers', function () {
      var filter = {
        providerCodes: ['a.com', 'b.com']
      };

      var hotel1 = {
        rates: createRatesWithProviderCodes(['a.com', 'b.com'])
      };

      var hotel2 = {
        rates: createRatesWithProviderCodes(['c.com', 'b.com'])
      };

      var hotel3 = {
        rates: createRatesWithProviderCodes(['c.com', 'd.com'])
      };

      var hotels = filtering.filterHotels([hotel1, hotel2, hotel3], filter);

      expect(hotels).to.deep.equal([hotel1, hotel2]);
    });

    it('filters by "BOW" and "HOTEL_WEBSITE" booking options', function () {
      var filter = {
        bookingOptions: ['BOW', 'HOTEL_WEBSITE']
      };

      var hotel1 = {
        rates: [
          {
            provider: { directBooking: true, isHotelWebsite: false, type: 'OTA' }
          },
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          }
        ]
      };

      var hotel2 = {
        rates: [
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          },
          {
            provider: { directBooking: false, isHotelWebsite: true, type: 'DIRECT' }
          }
        ]
      };

      var hotel3 = {
        rates: [
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          },
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          }
        ]
      };

      var hotels = filtering.filterHotels([hotel1, hotel2, hotel3], filter);

      expect(hotels).to.deep.equal([hotel1, hotel2]);
    });

    it('filters by "TRAVEL_AGENCY" booking options', function () {
      var filter = {
        bookingOptions: ['TRAVEL_AGENCY']
      };

      var hotel1 = {
        rates: [
          {
            provider: { directBooking: true, isHotelWebsite: false, type: 'OTA' }
          },
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          }
        ]
      };

      var hotel2 = {
        rates: [
          {
            provider: { directBooking: false, isHotelWebsite: true, type: 'DIRECT' }
          }
        ]
      };

      var hotel3 = {
        rates: [
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          },
          {
            provider: { directBooking: false, isHotelWebsite: false, type: 'OTA' }
          }
        ]
      };

      var hotels = filtering.filterHotels([hotel1, hotel2, hotel3], filter);

      expect(hotels).to.deep.equal([hotel1, hotel3]);
    });

  });

  function createRateWithRateAmenities(amenities) {
    return {
      rateAmenityIds: amenities
    }
  }

  function createRateWithProviderCode(providerCode) {
    return {
      providerCode: providerCode
    }
  }

  function createRatesWithProviderCodes(providerCodes) {
    var rates = [];

    providerCodes.forEach(function (providerCode) {
      rates.push(createRateWithProviderCode(providerCode));
    })

    return rates;
  }

  function createRateWithAmountUsd(amountUsd) {
    return {
      price: {
        amountUsd: amountUsd,
      }
    }
  }

  function createHotelWithReviewScore(score) {
    return createHotel({
      reviewMap: {
        ALL: {
          score: score,
        }
      }
    });
  }

  function createHotelWithDeals(usualAmountUsd, discountToUsualAmount) {
    var amountUsd = usualAmountUsd - (usualAmountUsd * discountToUsualAmount);
    return createHotel({
      rates: [
        {
          price: {
            amountUsd: amountUsd,
          },
          usualPrice: {
            discountToUsualAmount: discountToUsualAmount,
            usualAmountUsd: usualAmountUsd
          }
        }
      ]
    });
  }

  function createHotel(data) {
    return Object.assign({
      star: 1,
      rates: [],
      images: [],
    }, data);
  }
});
