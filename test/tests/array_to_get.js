import {describe, before, it} from 'mocha';
const chai = require('chai');
chai.use(require('chai-as-promised'));
const assert = chai.assert;

import {array_to_get} from './../../lib/array_to_get';

describe('server/helpers/array_to_get', function () {

  it('array_to_get', () => {
    let input = [];
    input.push({var: 'a', val: '1'});
    input.push({var: 'b', val: '2'});
    input.push({var: 'c', val: '3'});
    assert.equal('a=1&b=2&c=3', array_to_get({array: input}));
  });

});
