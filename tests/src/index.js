'use strict';

const {assert} = require('chai');
const Unitage = require('../../src/index');

describe('src/index.js', function () {

    it ('should be class', () => {
        let unit1 = new Unitage(428, 10, ['', 'k', 'm']);

        assert.strictEqual(unit1.value, 428);
        assert.strictEqual(unit1.step, 10);
        assert.deepEqual(unit1.units, ['', 'k', 'm']);

    });

});
