var utils = require('../src/utils');

describe('utils', () => {
  describe('#filterByTextMatching', () => {
    it('converts text to latin format before matching', () => {
      var text = 'Mövenpick hotel';
      var query = 'Movenpick';
      expect(utils.filterByTextMatching(text, query)).to.equal(true);
    });

    it("filters out undefined text", () => {
      var text = undefined;
      var query = "Movenpick";
      expect(utils.filterByTextMatching(text, query)).to.equal(false);
    });
  });
});
