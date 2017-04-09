# unitage

![Node version][node-image] [![NPM version][npm-image]][npm-url]

Unit conversion to shorten the length of the long number:

```javascript
const unitage = require('unitage');

const num = new unitage(100000, ['', 'k'], 1000);

num.toString(); // '100k'
```

## Usage

Create instance:

```javascript
const unitage = require('unitage');

unitage(1000, ['', 'k'], 1000);

// same as

new untiage(1000, ['', 'k'], 1000);
```

Define a unit converter:

```javascript
const unitage = require('unitage');

const byte = unitage.define(['b', 'kb', 'mb'], 1024);

byte(1).toString(); // '1b'
byte(1024).toString(); // '1kb'
byte(4194304).toString(); // '4mb'
```

`unitage.define(func)`would return a function which accepts `value` parameter and return a `unitage` instance.

Each unit can be configured with different multiples:

```javascripta
const unitage = require('unitage');

const level = unitage.define(['', {
    unit: 'hundred',
    step: 100
}, {
    unit: 'thousand',
    step: 10
}, {
    unit: 'million'，
    step: 1000
}]);

level(1).toString(); // '1'
level(120).toString(); // '1.2hundred'
level(13000).toString(); // '13thousand'
level(4300000).toString(); // '4.3million'
```

实例属性：

* value: 实际数值
* number: 当前显示数值
* unit: 当前单位

```javascript
const unitage = require('unitage');

const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

num.toString(); // '1.17kb'

num.value === 1200;
num.number === 1.171875;
num.unit === 'kb';
```

实例方法：

* `toString([unit=this.unit, maxDigits=2])`

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num) === (num + ''); // '1.17kb'
    num.toString(); // '1.17kb'
    num.toString(Infinity); // '1.171875kb'
    num.toString('mb'); // '0mb'
    num.toString('mb', Infinity); // '0.0011444091796875mb'
    ```

* `tryUnit(unit)`: 尝试最大的单位或指定的单位，确保显示数值不会小于1：

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num); // '1.17kb'

    num.tryUnit('b');

    num.toString(); // '1200b'

    num.tryUnit('mb');

    num.toString(); // '1.17kb'
    ```

* `setUnit(unit)`: 强制设置单元

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num); // '1.17kb'

    num.setUnit('mb');

    num.toString(Infinity); // '0.0011444091796875mb'
    ```

* `setValue(value)`: 设置数值

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num); // '1.17kb'

    num.setValue(1024);

    num.toString(); // '1kb'
    ```

* `setNumber(value)`: 设置显示数值

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num); // '1.17kb'

    num.setNumber(2);

    num.toString(); // '2kb'

    num.number; // 2

    num.value; // 2048

    num.unit; // 'kb'
    ```

* `getNumber(unit=this.unit, maxDigits=2)`: 获取特定单元下的显示数值

    ```javascript
    const unitage = require('unitage');

    const num = unitage(1200, ['b', 'kb', 'mb'], 1024);

    String(num); // '1.17kb'

    num.getNumber(); // 1.17

    num.getNumber('b'); // 1200

    num.getNumber('mb', Infinity); // 0.0011444091796875
    ```

[npm-url]: https://www.npmjs.com/package/unitage
[npm-image]: https://img.shields.io/npm/v/unitage.svg
[node-image]: https://img.shields.io/node/v/unitage.svg
