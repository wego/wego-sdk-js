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

  describe('#prepareRateProvider', function() {
    it('provider', function() {
      var providerCode = 1;
      var provider = {
        code: providerCode,
      };

      var rate = {
        providerCode: providerCode,
      };

      dataUtils.prepareRateProvider(rate, createStaticData({
        providers: {
          1: provider
        }
      }));

      expect(rate.provider).to.equal(provider);
    });
  });

  describe('#convertPrice', function() {
    it('#remaining amount, tax amount, total amount and total tax amount when having same currency', function() {
      var currencyCode = 'CC';
      var amount = 10;
      var amountUsd = 1;
      var totalAmount = 40;
      var totalAmountUsd = 2;
      var taxAmount = 2;
      var totalTaxAmount = 8;
      var price = {
        currencyCode: currencyCode,
        amount: amount,
        totalAmount: totalAmount,
        taxAmount: taxAmount,
        totalTaxAmount: totalTaxAmount,
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
      expect(convertedPrice.taxAmount).to.equal(taxAmount);
      expect(convertedPrice.totalTaxAmount).to.equal(totalTaxAmount);
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
      var taxAmount = 2;
      var taxAmountUsd = 1;
      var totalTaxAmount = 8;
      var totalTaxAmountUsd = 4;
      var ecpc = 0.5;
      var localTaxAmount = 1;
      var price = {
        currencyCode: currencyCode,
        amount: amount,
        totalAmount: totalAmount,
        amountUsd: amountUsd,
        totalAmountUsd: totalAmountUsd,
        taxAmount: taxAmount,
        taxAmountUsd: taxAmountUsd,
        totalTaxAmount: totalTaxAmount,
        totalTaxAmountUsd: totalTaxAmountUsd,
        ecpc: ecpc,
        localTaxAmount: localTaxAmount
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
      expect(convertedPrice.taxAmount).to.equal(taxAmount);
      expect(convertedPrice.taxAmountUsd).to.equal(taxAmountUsd);
      expect(convertedPrice.totalTaxAmount).to.equal(totalTaxAmount);
      expect(convertedPrice.totalTaxAmountUsd).to.equal(totalTaxAmountUsd);
      expect(convertedPrice.ecpc).to.equal(ecpc);
      expect(convertedPrice.localTaxAmount).to.equal(localTaxAmount);
    });
  });

  describe('#trimArray', function() {
    it('removes invalid array value', function() {
      expect(dataUtils.trimArray(['', '12345', undefined])).to.deep.equal(['12345']);
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
