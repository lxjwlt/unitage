'use strict';

const {assert} = require('chai');
const Unitage = require('../../src/index');

describe('src/index.js', function () {

    it('should be class', function () {
        let unitage = new Unitage(428, ['', 'k', 'm'], 10);

        assert.isOk(unitage);
        assert.strictEqual(unitage.value, 428);
    });

    it('class creator', function () {
        let unitage = Unitage(5551, ['a', 'p'], 11);

        assert.isOk(unitage);
        assert.strictEqual(unitage.value, 5551);
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

    //
    // describe('#getNumber', function () {
    //
    //     it('default', function () {
    //         let unitage = Unitage(1012, 1000, ['', 'k']);
    //
    //         assert.strictEqual(unitage.getNumber(), 1.012);
    //     });
    //
    //     it('empty units', function () {
    //         let unitage = Unitage(1012, 1, []);
    //
    //         assert.strictEqual(unitage.getNumber(), 1012);
    //     });
    //
    //     it('specify undefined unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);
    //
    //         assert.strictEqual(unitage.getNumber(''), 7.849895477294922);
    //     });
    //
    //     it('specify low unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);
    //
    //         assert.strictEqual(unitage.getNumber('b'), 8231212);
    //     });
    //
    //     it('specify big unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb', 'gb']);
    //
    //         assert.strictEqual(unitage.getNumber('gb'), 0.007665913552045822);
    //     });
    //
    // });
    //
    // describe('#setUnit', function () {
    //
    //     it('default', function () {
    //         let unitage = Unitage(1012, 1000, ['', 'k', 'm']);
    //
    //         assert.strictEqual(unitage.number, 1.012);
    //         assert.strictEqual(unitage.unit, 'k');
    //
    //         unitage.setUnit();
    //
    //         assert.strictEqual(unitage.number, 1.012);
    //         assert.strictEqual(unitage.unit, 'k');
    //     });
    //
    //     it('empty units', function () {
    //         let unitage = Unitage(1012, 1, []);
    //
    //         unitage.setUnit('k');
    //
    //         assert.strictEqual(unitage.number, 1012);
    //         assert.strictEqual(unitage.unit, '');
    //     });
    //
    //     it('specify undefined unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);
    //
    //         unitage.setUnit('');
    //
    //         assert.strictEqual(unitage.number, 7.849895477294922);
    //         assert.strictEqual(unitage.unit, 'mb');
    //     });
    //
    //     it('specify low unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb']);
    //
    //         unitage.setUnit('b');
    //
    //         assert.strictEqual(unitage.number, 8231212);
    //         assert.strictEqual(unitage.unit, 'b');
    //     });
    //
    //     it('specify big unit', function () {
    //         let unitage = Unitage(8231212, 1024, ['b', 'kb', 'mb', 'gb']);
    //
    //         unitage.setUnit('gb');
    //
    //         assert.strictEqual(unitage.number, 0.007665913552045822);
    //         assert.strictEqual(unitage.unit, 'gb');
    //     });
    //
    // });
    //
    // describe('#setNumber', function () {
    //
    //     it('specify number', function () {
    //         let unitage = Unitage(1001, 1000, ['', 'k']);
    //
    //         assert.strictEqual(unitage.unit, 'k');
    //
    //         unitage.setNumber(33);
    //
    //         assert.strictEqual(unitage.number, 33);
    //         assert.strictEqual(unitage.unit, 'k');
    //         assert.strictEqual(unitage.value, 33000);
    //     });
    //
    // });

});
