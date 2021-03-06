'use strict';

const {assert} = require('chai');
const Unitage = require('../../src/index');

describe('src/index.js', function () {

    it('should be class', function () {
        let unitage = new Unitage(428, ['', 'k', 'm'], 10);

        assert.isOk(unitage);
        assert.strictEqual(unitage.value, 428);
        assert.strictEqual(String(unitage), '4.28m');
    });

    it('class creator', function () {
        let unitage = Unitage(5551, ['a', 'p'], 11);

        assert.isOk(unitage);
        assert.strictEqual(unitage.value, 5551);
        assert.strictEqual(String(unitage), '504.64p');
    });

    it('error: step <= 0', function () {
        assert.throws(Unitage.bind(null, 0, [], 0), 'Expected step to be Integer greater than 0.');
        assert.throws(Unitage.bind(null, 0, [], -2), 'Expected step to be Integer greater than 0.');
    });

    it('error: step is float number', function () {
        assert.throws(Unitage.bind(null, 0, [], 0.123), 'Expect step to be integer.');
        assert.throws(Unitage.bind(null, 0, [], 1.3), 'Expect step to be integer.');
    });

    it('error: first step not 1', function () {
        let units = [{
            unit: '',
            step: 3
        }];
        assert.throws(Unitage.bind(null, 0, units, 4), 'The step of first unit should be 1.');
    });

    it('error: step empty', function () {
        assert.throws(Unitage.bind(null, 0, ['', 'b']), 'Step should Be number when unit is string.');
    });

    it('error: unit not string', function () {
        assert.throws(Unitage.bind(null, 0, [{step: 1}], 4), 'Expect unit to be string.');
        assert.throws(Unitage.bind(null, 0, ['', {unit: null}], 4), 'Expect unit to be string.');
    });

    it('error: multiple same units', function () {
        assert.throws(Unitage.bind(null, 0, ['', ''], 4), 'Unexpected multiple same unit.');
        assert.throws(Unitage.bind(null, 0, ['', {unit: ''}], 4), 'Unexpected multiple same unit.');
        assert.throws(Unitage.bind(null, 0, [{unit: 'k', step: 1}, {unit: 'k'}], 4), 'Unexpected multiple same unit.');
    });

    describe('@define', function () {

        it('default', function () {
            let storage = Unitage.define(['', 'k', 'm'], 1024);

            assert.strictEqual(storage(67834).toString(), '66.24k');
        });

    });

    describe('#tryUnit', function () {

        it('default', function () {
            let unitage = Unitage(12345678, ['one', 'w', 'y'], 10000);

            assert.strictEqual(unitage.number, 1234.5678);
            assert.strictEqual(unitage.unit, 'w');
        });

        it('negative value', function () {
            let unitage = Unitage(-1234567890, ['', 'k'], 1000);

            assert.strictEqual(unitage.number, -1234567.89);
            assert.strictEqual(unitage.unit, 'k');
        });

        it('min unit', function () {
            let unitage = Unitage(12345678, ['', 'w', 'y'], 10000);

            unitage.tryUnit('');

            assert.strictEqual(unitage.number, 12345678);
            assert.strictEqual(unitage.unit, '');
        });

        it('value < 1', function () {
            let unitage = Unitage(0.123, ['a', 'p'], 11);

            assert.strictEqual(unitage.number, 0.123);
            assert.strictEqual(unitage.unit, 'a');
        });

        it('default run again', function () {
            let unitage = Unitage(100000000, ['', 'w', 'y'], 10000);

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'y');

            unitage.tryUnit();

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'y');
        });

        it('1024 unit', function () {
            let unitage = Unitage(1073741824, ['B', 'KB', 'MB', 'GB'], 1024);

            assert.strictEqual(unitage.number, 1);
            assert.strictEqual(unitage.unit, 'GB');
        });

        it('overflow unit', function () {
            let unitage = Unitage(1073741824, ['B', 'KB', 'MB'], 1024);

            assert.strictEqual(unitage.number, 1024);
            assert.strictEqual(unitage.unit, 'MB');
        });

        it('empty unit', function () {
            let unitage = Unitage(1073741824, [], 1024);

            assert.strictEqual(unitage.number, 1073741824);
            assert.strictEqual(unitage.unit, '');
        });


        it('specify unit', function () {
            let unitage = Unitage(123456789, ['', 'k', 'm', 'g'], 1000);

            unitage.tryUnit('k');

            assert.strictEqual(unitage.number, 123456.789);
            assert.strictEqual(unitage.unit, 'k');
        });

        it('specify unit for value < 1', function () {
            let unitage = Unitage(0.123, ['a', 'p'], 11);

            unitage.tryUnit('p');

            assert.strictEqual(unitage.number, 0.123);
            assert.strictEqual(unitage.unit, 'a');
        });

        it('specify unknow unit', function () {
            let unitage = Unitage(123456789, ['', 'k', 'm', 'g'], 1000);

            unitage.tryUnit('j');

            assert.strictEqual(unitage.number, 123.456789);
            assert.strictEqual(unitage.unit, 'm');
        });


        it('specify overflow unit', function () {
            let unitage = Unitage(123456789, ['', 'k', 'm', 'g'], 1000);

            unitage.tryUnit('g');

            assert.strictEqual(unitage.number, 123.456789);
            assert.strictEqual(unitage.unit, 'm');
        });

        it('float number', function () {
            let unitage = Unitage(19, ['', 'n'], 13);

            unitage.tryUnit('n');

            assert.strictEqual(unitage.number, 1.4615384615384615);
            assert.strictEqual(unitage.unit, 'n');
        });

        it('specify step for big number', function () {
            let units = [
                '',
                {
                    unit: 'thousand',
                    step: 1000
                },
                'ten thousand',
                {
                    unit: 'million',
                    step: 100
                },
                {
                    unit: 'hundred million',
                    step: 100
                }
            ];

            let unitage = Unitage(123456789000, units, 10);

            assert.strictEqual(unitage.number, 1234.56789);
            assert.strictEqual(unitage.unit, 'hundred million');

            unitage.tryUnit('');

            assert.strictEqual(unitage.number, 123456789000);
            assert.strictEqual(unitage.unit, '');

            unitage.tryUnit('thousand');

            assert.strictEqual(unitage.number, 123456789);
            assert.strictEqual(unitage.unit, 'thousand');

            unitage.tryUnit('ten thousand');

            assert.strictEqual(unitage.number, 12345678.9);
            assert.strictEqual(unitage.unit, 'ten thousand');

            unitage.tryUnit('million');

            assert.strictEqual(unitage.number, 123456.789);
            assert.strictEqual(unitage.unit, 'million');

            unitage.tryUnit('hundred million');

            assert.strictEqual(unitage.number, 1234.56789);
            assert.strictEqual(unitage.unit, 'hundred million');
        });

        it('specify step for small number', function () {
            let units = [
                '',
                {
                    unit: 'thousand',
                    step: 1000
                },
                {
                    unit: 'hundred million',
                    step: 100000
                }
            ];

            let unitage = Unitage(1234, units, 10);

            assert.strictEqual(unitage.number, 1.234);
            assert.strictEqual(unitage.unit, 'thousand');

            unitage.tryUnit('hundred million');

            assert.strictEqual(unitage.number, 1.234);
            assert.strictEqual(unitage.unit, 'thousand');
        });

    });

    describe('#toString', function () {

        it('default', function () {
            let unitage = Unitage(1012, ['', 'k'], 1000);

            assert.strictEqual(unitage.toString(), '1.01k');
            assert.strictEqual(String(unitage), '1.01k');
        });

        it('empty units', function () {
            let unitage = Unitage(1012, [], 1);

            assert.strictEqual(unitage.toString(), '1012');
        });

        it('specify undefined unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb'], 1024);

            assert.strictEqual(unitage.toString(''), '7.85mb');
        });

        it('specify low unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb'], 1024);

            assert.strictEqual(unitage.toString('b'), '8231212b');
            assert.strictEqual(unitage.toString('kb'), '8038.29kb');
        });

        it('specify big unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb', 'gb'], 1024);

            assert.strictEqual(unitage.toString('gb'), '0.01gb');
        });

        it('specify digits', function () {
            let unitage = Unitage(1234567890, ['', 'k', 'm', 'g'], 1000);

            assert.strictEqual(unitage.toString('m', 10), '1234.56789m');
            assert.strictEqual(unitage.toString('m', 3), '1234.568m');
        });

        it('specify digits and no units', function () {
            let unitage = Unitage(1234567890, ['', 'k', 'm', 'g'], 1000);

            assert.strictEqual(unitage.toString(10), '1.23456789g');
            assert.strictEqual(unitage.toString(3), '1.235g');
        });

        it('negative number', function () {
            let unitage = Unitage(-1234567890, ['', 'k', 'm', 'g'], 1000);

            assert.strictEqual(unitage.toString(10), '-1.23456789g');
            assert.strictEqual(unitage.toString(3), '-1.235g');
        });

    });


    describe('#getNumber', function () {

        it('default', function () {
            let unitage = Unitage(1012, ['', 'k'], 1000);

            assert.strictEqual(unitage.getNumber(), 1.012);
        });

        it('empty units', function () {
            let unitage = Unitage(1012, [], 1);

            assert.strictEqual(unitage.getNumber(), 1012);
        });

        it('specify undefined unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb'], 1024);

            assert.strictEqual(unitage.getNumber(''), 7.849895477294922);
        });

        it('specify low unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb'], 1024);

            assert.strictEqual(unitage.getNumber('b'), 8231212);
        });

        it('specify big unit', function () {
            let unitage = Unitage(8231212, ['b', 'kb', 'mb', 'gb'], 1024);

            assert.strictEqual(unitage.getNumber('gb'), 0.007665913552045822);
        });

        it('specify digits', function () {
            let unitage = Unitage(10.11111, ['', 't'], 3);

            assert.strictEqual(unitage.getNumber('', 2), 10.11);
        });

        it('specify digits', function () {
            let unitage = Unitage(10, ['', 't'], 3);

            assert.strictEqual(unitage.getNumber(2), 3.33);
        });

    });


    describe('#setValue', function () {

        it('default', function () {
            let unitage = Unitage(1012, ['', 'k', 'm'], 1000);

            unitage.setValue(123456789);

            assert.strictEqual(unitage.number, 123456.789);
            assert.strictEqual(unitage.unit, 'k');
        });

    });


    describe('#setNumber', function () {

        it('specify number', function () {
            let unitage = Unitage(1001, ['', 'k'], 1000);

            unitage.setNumber(33);

            assert.strictEqual(unitage.number, 33);
            assert.strictEqual(unitage.unit, 'k');
            assert.strictEqual(unitage.value, 33000);
        });

    });

    describe('#setUnit', function () {

        it('specify unit', function () {
            let unitage = Unitage(1001, ['', 'k', 'm'], 1000);

            unitage.setUnit('m');

            assert.strictEqual(unitage.number, 0.001001);
            assert.strictEqual(unitage.unit, 'm');
            assert.strictEqual(unitage.value, 1001);
        });

        it('undefined unit', function () {
            let unitage = Unitage(1001, ['', 'k', 'm'], 1000);

            unitage.setUnit('z');

            assert.strictEqual(unitage.number, 1.001);
            assert.strictEqual(unitage.unit, 'k');
            assert.strictEqual(unitage.value, 1001);
        });

    });

});
