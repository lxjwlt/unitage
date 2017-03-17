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

    describe('#tryMaxUnit', function () {

        it('default', function () {
            let unitage = Unitage(12345678, 10000, ['', 'w', 'y']);

            assert.strictEqual(unitage.number, 1234.5678);
            assert.strictEqual(unitage.unit, 'w');
        });

        it('default run again', function () {
            let unitage = Unitage(100000000, 10000, ['', 'w', 'y']);

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'y');

            unitage.tryMaxUnit();

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'y');
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

        it('float number', function () {
            let unitage = Unitage(19, 13, ['', 'n']);

            unitage.tryMaxUnit('n');

            assert.strictEqual(unitage.number, 1.4615384615384615);
        });

    });

    describe('#toString', function () {

        it('default', function () {
            let unitage = Unitage(1012, 1000, ['', 'k']);

            assert.strictEqual(unitage.toString(), '1.012k');
            assert.strictEqual(String(unitage), '1.012k');
        });

        it('empty units', function () {
            let unitage = Unitage(1012, 1, []);

            assert.strictEqual(unitage.toString(), '1012');
        });

        it('specify undefined unit', function () {
            let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);

            assert.strictEqual(unitage.toString(''), '7.849895477294922mb');
        });

        it('specify low unit', function () {
            let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);

            assert.strictEqual(unitage.toString('b'), '8231212b');
        });

        it('specify big unit', function () {
            let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb', 'gb']);

            debugger;
            assert.strictEqual(unitage.toString('gb'), '0.007665913552045822gb');
        });

    });

});
