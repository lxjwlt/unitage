'use strict';

const {assert} = require('chai');
const Unitage = require('../../src/index');

describe('src/index.js', function () {

    it('should be class', function () {
        let unit1 = new Unitage(428, 10, ['', 'k', 'm']);

        assert.strictEqual(unit1.value, 428);
        assert.strictEqual(unit1.step, 10);
        assert.deepEqual(unit1.units, ['', 'k', 'm']);
    });

    it('class creator', function () {
        let unit1 = Unitage(5551, 11, ['', 'p']);

        assert.strictEqual(unit1.value, 5551);
        assert.strictEqual(unit1.step, 11);
        assert.deepEqual(unit1.units, ['', 'p']);
    });

    describe('@tryMaxUnit', function () {

        it('default', function () {
            let unitage = Unitage(12345678, 10000, ['', 'w', 'y']);

            assert.strictEqual(unitage.number, 1234.5678);
            assert.strictEqual(unitage.unit, 'w');
        });

        it('1024 unit', function () {
            let unitage = Unitage(1073741824, 1024, ['B', 'KB', 'MB', 'GB']);

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'GB');
        });

        it('overflow unit', function () {
            let unitage = Unitage(1073741824, 1024, ['B', 'KB', 'MB']);

            assert.strictEqual(unitage.number, 1024);
            assert.strictEqual(unitage.unit, 'MB');
        });

        it('empty unit', function () {
            let unitage = Unitage(1073741824, 1024, []);

            assert.strictEqual(unitage.number, 1073741824);
            assert.strictEqual(unitage.unit, '');
        });

        it('specify unit', function () {
            let unitage = Unitage(123456789, 1000, ['', 'k', 'm', 'g']);

            unitage.tryMaxUnit('k');

            assert.strictEqual(unitage.number, 123456.789);
            assert.strictEqual(unitage.unit, 'k');
        });

        it('specify unknow unit', function () {
            let unitage = Unitage(123456789, 1000, ['', 'k', 'm', 'g']);

            unitage.tryMaxUnit('j');

            assert.strictEqual(unitage.number, 123.456789);
            assert.strictEqual(unitage.unit, 'm');
        });

        it('specify overflow unit', function () {
            let unitage = Unitage(123456789, 1000, ['', 'k', 'm', 'g']);

            unitage.tryMaxUnit('g');

            assert.strictEqual(unitage.number, 123.456789);
            assert.strictEqual(unitage.unit, 'm');
        });

    });

});
