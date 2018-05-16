var dataUtils = require('../../src/hotel-search/dataUtils');

describe('dataUtils', function() {
  describe('#prepareResponseSearch', function() {
    it('region', function() {
      var regionId = 101;
      var cityCode = "DXB";

      var region = {
        id: regionId,
        cityCodes: [cityCode]
      };

      var search = {
        region: region,
      };

      var city = {
        code: cityCode,
        name: "city name"
      };

      dataUtils.prepareResponseSearch(search, createStaticData({
        cities: {
          "DXB": city,
        }
      }));

      expect(search.region.cities[0]).to.equal(city);
    });
  });

  describe('#prepareHotel', function() {
    it('district', function() {
      var districtId = 3;

      var hotel = {
        districtId: districtId,
      };

      var district = {
        id: districtId,
      };

      dataUtils.prepareHotel(hotel, createStaticData({
        districts: {
          3: district,
        }
      }));

      expect(hotel.district).to.equal(district);
    });

    it('reviews', function() {
      var reviewerGroup = 'ALL';
      var review = {
        reviewerGroup: reviewerGroup,
      };

      var hotel = {
        reviews: [review]
      };

      dataUtils.prepareHotel(hotel, createStaticData());

      expect(hotel.reviewMap[reviewerGroup]).to.equal(review);
    });

    it('ratesCount', function() {
      var hotel = {};
      dataUtils.prepareHotel(hotel, createStaticData());
      expect(hotel.ratesCounts.total).to.equal(0);
    });

    it('amenityIdMap', function() {
      var hotel = {
        amenityIds: [1, 2, 3]
      };
      dataUtils.prepareHotel(hotel, createStaticData());
      expect(hotel.amenityIdMap).to.deep.equal({
        1: true,
        2: true,
        3: true,
      });
    })
  });

  describe('#prepareRate', function() {
    it('provider', function() {
      var providerCode = 1;
      var provider = {
        code: providerCode,
      };

      var rate = {
        providerCode: providerCode,
      };

      dataUtils.prepareRate(rate, {}, createStaticData({
        providers: {
          1: provider
        }
      }));

      expect(rate.provider).to.equal(provider);
    });

    it('price', function() {
      var rate = {
        price: {
          currencyCode: 'VND',
          amountUsd: 10,
        }
      };

      var currency = {
        code: 'SGD',
        rate: 2
      };

      dataUtils.prepareRate(rate, currency, createStaticData());

      expect(rate.price.amount).to.equal(20);
    })
  });

  describe('#convertPrice', function() {
    it('#remaining amount and total amount when having same currency', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var amountUsd = 1;
      var totalAmount = 40;
      var totalAmountUsd = 2;
      var price = {
        currencyCode: currencyCode,
        amount: amount,
        totalAmount: totalAmount,
        amountUsd: amountUsd,
        totalAmountUsd: totalAmountUsd,
      };

      var currency = {
        code: currencyCode,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(amount);
      expect(convertedPrice.totalAmount).to.equal(totalAmount);
      expect(convertedPrice.amountUsd).to.equal(amountUsd);
      expect(convertedPrice.totalAmountUsd).to.equal(totalAmountUsd);
    });

    it('#converting amountUsd and totalAmountUsd to different currency when having different currency', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var totalAmount = 40;
      var price = {
        currencyCode: 'FC',
        amountUsd: 5,
        totalAmountUsd: 20,
      };

      var currency = {
        code: currencyCode,
        rate: 2,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(amount);
      expect(convertedPrice.totalAmount).to.equal(totalAmount);
    });

    it('#returns converted price include all other fields', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var amountUsd = 1;
      var totalAmount = 40;
      var totalAmountUsd = 2;
      var taxAmountUsd = 1;
      var ecpc = 0.5;
      var localTaxAmount = 1;
      var price = {
        currencyCode: currencyCode,
        amount: amount,
        totalAmount: totalAmount,
        amountUsd: amountUsd,
        totalAmountUsd: totalAmountUsd,
        taxAmountUsd: taxAmountUsd,
        ecpc: ecpc,
        localTaxAmount: localTaxAmount,
      };

      var currency = {
        code: currencyCode,
      };

      var convertedPrice = dataUtils.convertPrice(price, currency);

      expect(convertedPrice.currency).to.equal(currency);
      expect(convertedPrice.amount).to.equal(amount);
      expect(convertedPrice.totalAmount).to.equal(totalAmount);
      expect(convertedPrice.amountUsd).to.equal(amountUsd);
      expect(convertedPrice.totalAmountUsd).to.equal(totalAmountUsd);
      expect(convertedPrice.taxAmountUsd).to.equal(taxAmountUsd);
      expect(convertedPrice.ecpc).to.equal(ecpc);
      expect(convertedPrice.localTaxAmount).to.equal(localTaxAmount);
    });
  });

  describe('#trimArray', function() {
    it('removes invalid array value', function() {
      expect(dataUtils.trimArray(['', '12345', undefined])).to.deep.equal(['12345']);
    });
  });

  describe('#isBetterRate', function() {
    function bestRateOf(rates) {
      rates.sort(function(rate1, rate2) {
        return dataUtils.isBetterRate(rate1, rate2) ? -1 : 1;
      });
      return rates[0];
    }

    it('resolve by tax amount usd', function() {
      var r1 = {
        price: {
          taxAmountUsd: 0,
        }
      };

      var r2 = {
        price: {
          taxAmountUsd: -2,
        }
      };

      expect(bestRateOf([r1, r2])).to.equal(r1);
    });

    it('resolve by price', function() {
      var r1 = {
        price: {
          amount: 11.1
        }
      };

      var r2 = {
        price: {
          amount: 12.1
        }
      };

      expect(bestRateOf([r1, r2])).to.equal(r1);
    });

    it('resolve by ecpc', function() {
      var r1 = {
        price: {
          amount: 100000.3,
          ecpc: 1,
        }
      };

      var r2 = {
        price: {
          amount: 100099.2,
          ecpc: 2,
        }
      };

      expect(bestRateOf([r1, r2])).to.equal(r1);
    });

    it('compare three prices', function() {
      var r1 = {
        price: {
          amount: 100000,
          ecpc: 1,
        }
      };

      var r2 = {
        price: {
          amount: 100099,
          ecpc: 2,
        }
      };

      var r3 = {
        price: {
          amount: 1000,
          ecpc: 1000,
        }
      };

      expect(bestRateOf([r1, r2, r3])).to.equal(r3);
    });

    it('compare two rates when price and provider type same', function() {
      var r1 = {
        price: {
          amount: 10000,
          ecpc: 1
        },
        provider: {
          code: 'provider1',
          type: 'DIRECT_PRIORITY'
        }
      };

      var r2 = {
        price: {
          amount: 10000,
          ecpc: 2
        },
        provider: {
          code: 'provider2',
          type: 'DIRECT_PRIORITY'
        }
      };

      expect(bestRateOf([r1, r2])).to.equals(r2);
    });

    it('compare two rates when price is same but first with direct_priority provider', function() {
      var r1 = {
        price: {
          amount: 10000,
          ecpc: 1
        },
        provider: {
          code: 'provider1',
          type: 'DIRECT_PRIORITY'
        }
      };

      var r2 = {
        price: {
          amount: 10000,
          ecpc: 2
        },
        provider: {
          code: 'provider2',
          type: 'OTA'
        }
      };

      expect(bestRateOf([r1, r2])).to.equals(r1)
    });
  });

  function createStaticData(data) {
    return Object.assign({
      districts: {},
      cities: {},
      providers: {},
      propertyTypes: {}
    }, data);
  }
});
