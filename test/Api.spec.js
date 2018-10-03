var Api = require("../src/Api");

describe("API", () => {
  describe("_hotelEndpoints", function() {
    describe("production env", function() {
      beforeEach(function() {
        Api.setEnvironment("production");
      });
      it("returns searchHotelsUrl", function() {
        expect(Api._hotelEndpoints.searchHotelsUrl()).to.equal(
          "https://srv.wego.com/v3/metasearch/hotels/searches"
        );
      });
      it("returns searchSingleHotelUrl", function() {
        expect(Api._hotelEndpoints.searchSingleHotelUrl(9001)).to.equal(
          "https://srv.wego.com/v3/metasearch/hotels/9001/searches"
        );
      });
      it("returns hotelDetailsUrl", function() {
        expect(Api._hotelEndpoints.hotelDetailsUrl(9001)).to.equal(
          "https://srv.wego.com/hotels/hotels/9001"
        );
      });
    });
    describe("non production env", function() {
      beforeEach(function() {
        Api.setEnvironment("staging");
      });
      it("returns searchHotelsUrl", function() {
        expect(Api._hotelEndpoints.searchHotelsUrl()).to.equal(
          "https://srv.wegostaging.com/v3/metasearch/hotels/searches"
        );
      });
      it("returns searchSingleHotelUrl", function() {
        expect(Api._hotelEndpoints.searchSingleHotelUrl(9001)).to.equal(
          "https://srv.wegostaging.com/v3/metasearch/hotels/9001/searches"
        );
      });
      it("returns hotelDetailsUrl", function() {
        expect(Api._hotelEndpoints.hotelDetailsUrl(9001)).to.equal(
          "https://srv.wegostaging.com/hotels/hotels/9001"
        );
      });
    });
  });

  describe("buildUrl", function() {
    it("build url when query value type is primitive", () => {
      var uri = "url";
      var query = { a: 1, b: 2 };
      expect(Api.buildUrl(uri, query)).to.equal("url?a=1&b=2");
    });

    it("build url when query value type is array", function() {
      var uri = "url";
      var query = { a: [1, 2] };
      expect(Api.buildUrl(uri, query)).to.equal("url?a[]=1&a[]=2");
    });
  });
});
