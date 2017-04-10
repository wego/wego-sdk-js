var Api = require('../src/Api');

describe('API', () => {
  describe('buildUrl', function() {
    it('build url when query value type is primitive', () => {
      var uri = 'url';
      var query = { a: 1, b: 2 };
      expect(Api.buildUrl(uri, query)).to.equal('url?a=1&b=2');
    });

    it('build url when query value type is array', function() {
      var uri = 'url';
      var query = { a: [1, 2] };
      expect(Api.buildUrl(uri, query)).to.equal('url?a[]=1&a[]=2');
    });
  })
});