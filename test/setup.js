const chai = require("chai");
const chaiAsPromised = require("chai-as-promised");
const dirtyChai = require("dirty-chai");
const spies = require("chai-spies");
const sinonChai = require("sinon-chai");

chai.use(dirtyChai);
chai.use(spies);
chai.use(chaiAsPromised);
chai.use(sinonChai);

chai.config.includeStack = true;

global.expect = chai.expect;
global.AssertionError = chai.AssertionError;
global.Assertion = chai.Assertion;
global.assert = chai.assert;
global.expect.spy = chai.spy;
global.Wego = {};
global.fetch = function() {
  return Promise.resolve();
};
