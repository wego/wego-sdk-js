var Api = require("../src/Api");
var sinon = require("sinon");

describe("API", () => {
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

  describe("#addHeader", () => {
    it("adds item in the header", () => {
      expect(Api.__headers).not.to.have.property("Authorization");
      Api.addHeader({ Authorization: "Bearer 123xyz" });
      expect(Api.__headers).to.have.property("Authorization");
    });
  });

  describe("#getEnvironment", () => {
    it("is staging by default", () => {
      expect(Api.getEnvironment()).to.equal("staging");
    });
    it("sets environment to production", () => {
      Api.setEnvironment("production");
      expect(Api.getEnvironment()).to.equal("production");
    });
  });

  describe("#searchHotels", function() {
    beforeEach(function() {
      Api.setEnvironment("staging");
    });
    afterEach(function() {
      Api.post.restore();
    });
    it("calls staging API", () => {
      var spy = sinon.spy(Api, "post");
      Api.searchHotels({}, {});
      expect(spy).to.have.been.calledWith(
        {},
        "https://srv.wegostaging.com/metasearch/hotels/searches",
        {}
      );
    });
    it("calls production API", () => {
      Api.setEnvironment("production");
      var spy = sinon.spy(Api, "post");
      Api.searchHotels({}, {});
      expect(spy).to.have.been.calledWith(
        {},
        "https://srv.wego.com/metasearch/hotels/searches",
        {}
      );
    });
  });
});
