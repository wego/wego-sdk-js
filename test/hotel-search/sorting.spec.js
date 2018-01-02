var sorting = require('../../src/hotel-search/sorting');

describe('wego-hotel-search-sorting', function() {
  describe('#sortHotels', function() {
    it('sorting by price', function() {
      var hotel1 = createHotelWithBestRateAmountUsd(1);
      var hotel2 = createHotelWithBestRateAmountUsd(3);
      var hotel3 = createHotelWithBestRateAmountUsd(2);
      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'PRICE',
        order: 'ASC',
      });

      expect(hotels).to.deep.equal([hotel1, hotel3, hotel2]);
    });

    it('sorting by price', function() {
      var hotel1 = createHotelWithBestRateAmountUsd(1);
      var hotel2 = createHotelWithBestRateAmountUsd(3);
      var hotel3 = createHotelWithBestRateAmountUsd(2);
      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'PRICE',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by best discount', function() {
      var hotel1 = createHotelWithDeals(100, 0.15);
      var hotel2 = createHotelWithDeals(300, 0.25);
      var hotel3 = createHotelWithDeals(200, 0.20);
      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'DISCOUNT',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by biggest savings', function() {
      var hotel1 = createHotelWithDeals(100, 0.15);
      var hotel2 = createHotelWithDeals(200, 0.25);
      var hotel3 = createHotelWithDeals(300, 0.20);
      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'SAVINGS',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel3, hotel2, hotel1]);
    });

    it('sorting by all review score', function() {
      var hotel1 = createHotelWithReviewScore(1, 'ALL');
      var hotel2 = createHotelWithReviewScore(3, 'ALL');
      var hotel3 = createHotelWithReviewScore(2, 'ALL');

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'ALL_REVIEW_SCORE',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by family review score', function() {
      var hotel1 = createHotelWithReviewScore(1, 'FAMILY');
      var hotel2 = createHotelWithReviewScore(3, 'FAMILY');
      var hotel3 = createHotelWithReviewScore(2, 'FAMILY');

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'FAMILY_REVIEW_SCORE',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by business review score', function() {
      var hotel1 = createHotelWithReviewScore(1, 'BUSINESS');
      var hotel2 = createHotelWithReviewScore(3, 'BUSINESS');
      var hotel3 = createHotelWithReviewScore(2, 'BUSINESS');

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'BUSINESS_REVIEW_SCORE',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by couple review score', function() {
      var hotel1 = createHotelWithReviewScore(1, 'COUPLE');
      var hotel2 = createHotelWithReviewScore(3, 'COUPLE');
      var hotel3 = createHotelWithReviewScore(2, 'COUPLE');

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'COUPLE_REVIEW_SCORE',
        order: 'DESC',
      })

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by solo review score', function() {
      var hotel1 = createHotelWithReviewScore(1, 'SOLO');
      var hotel2 = createHotelWithReviewScore(3, 'SOLO');
      var hotel3 = createHotelWithReviewScore(2, 'SOLO');

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'SOLO_REVIEW_SCORE',
        order: 'DESC',
      });

      expect(hotels).to.deep.equal([hotel2, hotel3, hotel1]);
    });

    it('sorting by popularity', function() {
      var hotel1 = { score: 1 };
      var hotel2 = { score: 3 };
      var hotel3 = { score: 2 };
      var hotel4 = { };

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3, hotel4], {
        by: 'SCORE',
        order: 'ASC',
      });

      expect(hotels).to.deep.equal([hotel1, hotel3, hotel2, hotel4]);
    });

    it('sorting by star', function() {
      var hotel1 = { star: 1 };
      var hotel2 = { star: 3 };
      var hotel3 = { star: 2 };
      var hotel4 = { star: 0 };

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3, hotel4], {
        by: 'STAR',
        order: 'ASC',
      })

      expect(hotels).to.deep.equal([hotel1, hotel3, hotel2, hotel4]);
    });

    it('sorting by distanceToCityCentre', function() {
      var hotel1 = {
        distanceToCityCentre: 1
      };

      var hotel2 = {
        distanceToCityCentre: 3
      };

      var hotel3 = {
        distanceToCityCentre: 2,
        rates: [
          {
            price: {
              amountUsd: 5,
            }
          }
        ]
      };

      var hotel4 = {
        distanceToCityCentre: 2,
        rates: [
          {
            price: {
              amountUsd: 2,
            }
          }
        ]
      };

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3, hotel4], {
        by: 'DISTANCE_TO_CITY_CENTER',
        order: 'ASC',
      })

      expect(hotels).to.deep.equal([hotel1, hotel4, hotel3, hotel2]);
    });

    it('sorting by the nearest airport', function() {
      var hotel1 = { distanceToNearestAirport: 1 };
      var hotel2 = { distanceToNearestAirport: 3 };
      var hotel3 = { distanceToNearestAirport: 2 };

      var hotels = sorting.sortHotels([hotel1, hotel2, hotel3], {
        by: 'DISTANCE_TO_NEAREST_AIRPORT',
        order: 'ASC',
      });

      expect(hotels).to.deep.equal([hotel1, hotel3, hotel2]);
    });

    it('sort new array reference of hotels', function() {
      var hotel1 = { distanceToNearestAirport: 1 };
      var hotel2 = { distanceToNearestAirport: 3 };
      var hotel3 = { distanceToNearestAirport: 2 };

      var hotels = [hotel1, hotel2, hotel3];
      var sortedHotels = sorting.sortHotels(hotels, {
        by: 'DISTANCE_TO_NEAREST_AIRPORT',
        order: 'ASC',
      });

      expect(sortedHotels).to.not.equal(hotels);
    })
  });

  function createHotelWithBestRateAmountUsd(amountUsd) {
    return createHotel({
      rates: [
        {
          price: {
            amountUsd: amountUsd,
          }
        }
      ]
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

  function createHotelWithReviewScore(score, type) {
    var reviewMap = {};
    reviewMap[type] = {
      score: score,
    };
    return createHotel({
      reviewMap: reviewMap,
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
