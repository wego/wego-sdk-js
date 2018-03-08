var HotelSearchMerger = require('../../src/hotel-search/Merger');

describe('Merger', function() {
  var merger;

  beforeEach(function() {
    merger = new HotelSearchMerger();
    merger.reset();
    merger.currency = {};
  });

  describe('#reset', function() {
    it('clearing hotelMap', function() {
      merger.reset();
      expect(merger.__hotelMap).to.deep.equal({});
    });
  });

  describe('#updateCurrency', function() {
    it('update hotel rate', function() {
      var hotel = {
        id: 1,
      };
      
      var roomsCount = 1;
      var nightsCount = 2;
      var amountUsd = 10.15;
      var totalAmountUsd = amountUsd * roomsCount * nightsCount;

      var rate = {
        hotelId: 1,
        price: {
          currencyCode: 'vnd',
          amountUsd: 10.15,
          totalAmountUsd: totalAmountUsd
        }
      };

      var currency = {
        code: 'sgd',
        rate: 2,
      };

      merger.mergeResponse({
        hotels: [hotel],
        rates: [rate]
      });

      var oldHotels = merger.getHotels();
      var oldHotel = oldHotels[0];

      merger.updateCurrency(currency);

      var newHotels = merger.getHotels();
      var newHotel = newHotels[0];

      expect(newHotel.rates[0].price.amount).to.equal(20);
      expect(newHotel.rates[0].price.totalAmount).to.equal(40);
      expect(newHotels).to.not.equal(oldHotels);
      expect(newHotel).to.not.equal(oldHotel);
    });

    it('update minPrice', function() {
      merger.mergeResponse({
        filter: {
          minPrice: {
            currencyCode: 'vnd',
            amountUsd: 10,
          }
        }
      });

      var oldFilter = merger.getFilter();
      var oldMinPrice = oldFilter.minPrice;

      merger.updateCurrency({
        code: 'sgd',
        rate: 2,
      });

      var newFilter = merger.getFilter();
      var newMinPrice = newFilter.minPrice;

      expect(newMinPrice.amount).to.equal(20);
      expect(newFilter).to.not.equal(oldFilter);
      expect(newMinPrice).to.not.equal(oldMinPrice);
    });

    it('update maxPrice', function() {
      merger.mergeResponse({
        filter: {
          maxPrice: {
            currencyCode: 'vnd',
            amountUsd: 10,
          }
        }
      });

      var oldFilter = merger.getFilter();
      var oldMaxPrice = oldFilter.maxPrice;

      merger.updateCurrency({
        code: 'sgd',
        rate: 2,
      });

      var newFilter = merger.getFilter();
      var newMaxPrice = newFilter.maxPrice;

      expect(newMaxPrice.amount).to.equal(20);
      expect(newFilter).to.not.equal(oldFilter);
      expect(newMaxPrice).to.not.equal(oldMaxPrice);
    });
  });

  describe('merge static data', function() {
    it('merging stars', function() {
      var star = {
        id: 1,
        name: '1',
      };

      merger.mergeResponse({
        stars: [star]
      });

      expect(merger.__staticData.stars[1]).to.equal(star);
    });

    it('merging brands', function() {
      var brand = {
        id: 1,
      };

      merger.mergeResponse({
        brands: [brand]
      });

      expect(merger.__staticData.brands[1]).to.equal(brand);
    });

    it('merging providers', function() {
      var provider = {
        id: 1,
        code: 'booking.com'
      };

      merger.mergeResponse({
        providers: [provider]
      });

      expect(merger.__staticData.providers['booking.com']).to.equal(provider);
    });

    it('merging propertyTypes', function() {
      var propertyType = {
        id: 1,
      };

      merger.mergeResponse({
        propertyTypes:[propertyType]
      });

      expect(merger.__staticData.propertyTypes[1]).to.equal(propertyType);
    });

    it('merging districts', function() {
      var district = {
        id: 1,
      };

      merger.mergeResponse({
        districts: [district]
      });

      expect(merger.__staticData.districts[1]).to.equal(district);
    });

    it('merging cities', function() {
      var city = {
        code: "SIN",
      };

      merger.mergeResponse({
        cities: [city]
      });

      expect(merger.__staticData.cities["SIN"]).to.equal(city);
    });

    it('merging amenities', function() {
      var amenity = {
        id: 1,
      };

      merger.mergeResponse({
        amenities: [amenity]
      });

      expect(merger.__staticData.amenities[1]).to.equal(amenity);
    });

    it('merging rateAmenities', function() {
      var amenity1 = {
        code: 'BREAKFAST_INCLUDED',
        id: 1,
        name: 'breadfast included'
      };

      var amenity2 = {
        code: 'FREE_WIFI',
        id: 2,
        name: 'free wifi'
      };

      merger.mergeResponse({
        rateAmenities: [amenity1, amenity2]
      });

      expect(merger.__staticData.rateAmenities[1]).to.equal(amenity1);
      expect(merger.__staticData.rateAmenities[2]).to.equal(amenity2);

    });

  });

  describe('merge hotels', function() {
    it('updating hotelMap', function () {
      var district = {
        id: 1,
      };

      var city = {
        code: "SIN",
      };

      var hotel = {
        id: 3,
        districtId: 1,
        cityCode: "SIN",
      };
      merger.mergeResponse({
        districts: [district],
        cities: [city],
        hotels: [hotel]
      });

      expect(merger.__hotelMap[3].id).to.equal(3);
      expect(merger.__hotelMap[3].district).to.equal(district);
      expect(merger.__hotelMap[3].city).to.equal(city);
    });
  });

  describe('merging rates',function() {
    it('insert of rate of new provider', function() {
      var rate1 = {
        id: 1,
        hotelId: 1,
        providerCode: 'x',
        price: {
          amount: 100,
        }
      };

      var rate2 = {
        id: 2,
        hotelId: 1,
        providerCode: 'y',
        price: {
          amount: 70,
        }
      };

      var rate3 = {
        id: 3,
        hotelId: 1,
        providerCode: 'z',
        price: {
          amount: 80,
        }
      };

      var hotel = {
        id: 1,
      };

      merger.mergeResponse({
        rates: [rate1, rate2],
        hotels: [hotel],
      });

      var oldHotels = merger.getHotels();
      var oldHotel = oldHotels[0];

      merger.mergeResponse({
        rates: [rate3]
      });

      var newHotels = merger.getHotels();
      var newHotel = newHotels[0];

      expect(getRateIds(newHotel.rates)).to.deep.equal([2, 3, 1]);
      expect(newHotel).to.not.equal(oldHotel);
      expect(newHotels).to.not.equal(oldHotels);
    });

    it('update with better rate', function() {
      var rate1 = {
        id: 1,
        hotelId: 1,
        providerCode: 'x',
        price: {
          amount: 100,
        }
      };

      var rate2 = {
        id: 2,
        hotelId: 1,
        providerCode: 'y',
        price: {
          amount: 70,
        }
      };

      var rate3 = {
        id: 3,
        hotelId: 1,
        providerCode: 'y',
        price: {
          amount: 60,
        }
      };

      var hotel = {
        id: 1,
      };

      merger.mergeResponse({
        rates: [rate1, rate2],
        hotels: [hotel],
      });

      merger.mergeResponse({
        rates: [rate3]
      });

      expect(getRateIds(merger.__hotelMap[1].rates)).to.deep.equal([3, 1]);
    });

    it('not update with worse rate', function() {
      var rate1 = {
        id: 1,
        hotelId: 1,
        providerCode: 'x',
        price: {
          amount: 100,
        }
      };

      var rate2 = {
        id: 2,
        hotelId: 1,
        providerCode: 'y',
        price: {
          amount: 70,
        }
      };

      var rate3 = {
        id: 3,
        hotelId: 1,
        providerCode: 'y',
        price: {
          amount: 120,
        }
      };

      var hotel = {
        id: 1,
      };

      merger.mergeResponse({
        rates: [rate1, rate2],
        hotels: [hotel],
      });

      merger.mergeResponse({
        rates: [rate3]
      });

      expect(getRateIds(merger.__hotelMap[1].rates)).to.deep.equal([2, 1]);
    });

    it("some hotel may have more than 1 from a provider rate when search's is end", () => {
      var response = {
        hotels: [{ id: 1},{ id: 2}],
        rates: [
          { id: 1, hotelId: 1, providerCode: "a.com", price: {amount: 100, taxAmountUsd: 1}},
          { id: 2, hotelId: 1, providerCode: "a.com", price: {amount: 110, taxAmountUsd: 1}},
          { id: 3, hotelId: 2, providerCode: "a.com", price: {amount: 120, taxAmountUsd: 1}},
          { id: 4, hotelId: 2, providerCode: "b.com", price: {amount: 130, taxAmountUsd: 1}},
          { id: 5, hotelId: 1, providerCode: "a.com", price: {amount: 140, taxAmountUsd: 1}}
        ]
      }
      merger.updateCurrency(null);
      merger.mergeResponse(response, true);
      expect(merger.__hotelMap[1].rates.length).to.equal(3);
      expect(merger.__hotelMap[2].rates.length).to.equal(2);
    });
  });

  it('merge score', function() {
    var hotel = {
      id: 1,
    };

    merger.mergeResponse({
      hotels: [hotel]
    });

    var oldHotels = merger.getHotels();

    merger.mergeResponse({
      scores: {
        1: 2,
      },
    });

    var newHotels = merger.getHotels();

    expect(newHotels[0].score).to.equal(2);
    expect(newHotels).to.not.equal(oldHotels);
    expect(newHotels[0]).to.not.equal(oldHotels[0]);
  });

  describe('merge ratesCount', function() {
    it('update provider rates count', function() {
      var providerCode = 'SG';
      var hotel = {
        id: 1,
      };

      merger.mergeResponse({
        hotels: [hotel],
        providerRatesCounts: [{
          hotelId: 1,
          providerCode: providerCode,
          ratesCount: 3,
        }],
      });

      var oldHotels = merger.getHotels();
      var oldHotel = oldHotels[0];
      var oldRatesCounts = oldHotel.ratesCounts;

      expect(hotel.ratesCounts.total).to.equal(3);
      expect(hotel.ratesCounts[providerCode]).to.equal(3);
      expect(hotel.ratesCounts.total).to.equal(3);

      merger.debug = true;

      merger.mergeResponse({
        providerRatesCounts: [{
          hotelId: 1,
          providerCode: providerCode,
          ratesCount: 5,
        }],
      });

      var newHotels = merger.getHotels();
      var newHotel = newHotels[0];

      expect(hotel.ratesCounts[providerCode]).to.equal(5);
      expect(hotel.ratesCounts.total).to.equal(5);
      expect(newHotel).to.not.equal(oldHotel);
      expect(newHotels).to.not.equal(oldHotels);
      expect(newHotel.ratesCounts).to.not.equal(oldRatesCounts);
    });
  });

  describe('merge filter', function() {
    it('updating hotels count for existing options', function() {
      var option = {
        code: 1,
        count: 5
      };

      var newOption = {
        code: 1,
        count: 7
      };

      merger.mergeResponse({
        filter: {
          stars: [option]
        }
      });

      merger.mergeResponse({
        filter: {
          stars: [newOption]
        }
      });

      var filter = merger.getFilter();

      expect(filter.stars.length).to.equal(1);
      expect(filter.stars[0].count).to.equal(7);
    });

    it('inserting new option in alphabet sorted order', function() {
      merger.reset();

      var option1 = {
        code: 1,
        count: 5
      };

      var option2 = {
        code: 2,
        count: 7
      };

      var option3 = {
        code: 3,
        count: 7
      };

      var brand1 = {
        id: 1,
        name: 'ab'
      };

      var brand2 = {
        id: 2,
        name: 'cd',
      };

      var brand3 = {
        id: 3,
        name: 'ac',
      };

      merger.mergeResponse({
        brands: [brand1, brand2, brand3],
        filter: {
          brands: [option1, option2]
        }
      });

      var oldFilter = merger.getFilter();
      var oldBrandOptions = oldFilter.brands;

      merger.mergeResponse({
        filter: {
          brands: [option3]
        }
      });

      var filter = merger.getFilter();
      var brandCodes = filter.brands.map(function(brand) {
        return brand.code;
      });

      expect(brandCodes).to.deep.equal([1, 3, 2]);
      expect(filter.brands).to.not.equal(oldBrandOptions);
      expect(filter).to.not.equal(oldFilter);
    });

    it('chains', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.chains = {
        1: {
          code: 1,
          name: 'chain',
        }
      };

      merger.mergeResponse({
        filter: {
          chains: [option],
        }
      });

      var filter = merger.getFilter();
      expect(filter.chains[0].name).to.equal('chain');
    });

    it('cities', function() {
      var option = {
        code: 1,
      };

      merger.__staticData.cities = {
        1: {
          code: 1,
          name: 'city',
        }
      };

      merger.mergeResponse({
        filter: {
          cities: [option],
        }
      });

      var filter = merger.getFilter();
      expect(filter.cities[0].name).to.equal('city');
    });
    
    it('minPrice', function() {
      var price  = {
        currencyCode: 'sgd',
        amountUsd: 10,
      };

      merger.currency = {
        rate: 2,
        currencyCode: 'vnd',
      };

      merger.mergeResponse({
        filter: {
          minPrice: price,
        }
      });
      var filter = merger.getFilter();

      expect(filter.minPrice.amount).to.equal(20);
    });

    it('maxPrice', function() {
      var price  = {
        currencyCode: 'sgd',
        amountUsd: 10,
      };

      merger.currency = {
        rate: 2,
        currencyCode: 'vnd',
      };

      merger.mergeResponse({
        filter: {
          maxPrice: price,
        }
      });
      var filter = merger.getFilter();

      expect(filter.maxPrice.amount).to.equal(20);
    });
  });

  function getRateIds(rates) {
    return rates.map(function(rate) {
      return rate.id;
    });
  }
});