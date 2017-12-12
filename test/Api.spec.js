var Api = require("../src/Api");

describe("API", () => {
  describe("hotelEndpoints", function() {
    describe("production env", function() {
      beforeEach(function() {
        Api.setEnvironment("production");
      });
      it("returns searchHotelsUrl", function() {
        expect(Api.hotelEndpoints.searchHotelsUrl()).to.equal(
          "https://srv.wego.com/v2/metasearch/hotels/searches"
        );
      });
      it("returns fetchHotelsUrl", function() {
        expect(Api.hotelEndpoints.fetchHotelsUrl("searchId12312")).to.equal(
          "https://srv.wego.com/v2/metasearch/hotels/searches/searchId12312/results"
        );
      });
      it("returns searchSingleHotelUrl", function() {
        expect(Api.hotelEndpoints.searchSingleHotelUrl(9001)).to.equal(
          "https://srv.wego.com/v2/metasearch/hotels/9001/searches"
        );
      });
      it("returns hotelDetailsUrl", function() {
        expect(Api.hotelEndpoints.hotelDetailsUrl(9001)).to.equal(
          "https://srv.wego.com/hotels/hotels/9001"
        );
      });
    });
    describe("non production env", function() {
      beforeEach(function() {
        Api.setEnvironment("staging");
      });
      it("returns searchHotelsUrl", function() {
        expect(Api.hotelEndpoints.searchHotelsUrl()).to.equal(
          "https://srv.wegostaging.com/v2/metasearch/hotels/searches"
        );
      });
      it("returns fetchHotelsUrl", function() {
        expect(Api.hotelEndpoints.fetchHotelsUrl("searchId12312")).to.equal(
          "https://srv.wegostaging.com/v2/metasearch/hotels/searches/searchId12312/results"
        );
      });
      it("returns searchSingleHotelUrl", function() {
        expect(Api.hotelEndpoints.searchSingleHotelUrl(9001)).to.equal(
          "https://srv.wegostaging.com/v2/metasearch/hotels/9001/searches"
        );
      });
      it("returns hotelDetailsUrl", function() {
        expect(Api.hotelEndpoints.hotelDetailsUrl(9001)).to.equal(
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
