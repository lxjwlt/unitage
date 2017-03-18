/**
 * @file unitage class
 */

'use strict';

class Unitage {

    constructor (value, step, units) {
        let self = this;

        self.value = value;

        self.step = step;

        self.units = units;

        self.tryMaxUnit();
    }

    tryMaxUnit (unit) {
        let self = this;

        let maxIndex = self.units.indexOf(unit);

        maxIndex = maxIndex < 0 ? Infinity : maxIndex;

        let result = specifyUnit(self.value, self.step, self.units, (value, index) => {
            return index < maxIndex && value >= self.step;
        });

        self.number = result.number;
        self.unit = result.unit;
    }

    getNumber (unit) {
        let self = this;
        let result = byUnit.call(self, unit);

        return result ? result.number : self.number;
    }

    toString (unit) {
        let self = this;
        let result = byUnit.call(self, unit);

        return result ? result.number + result.unit : self.number + self.unit;
    }


}

function byUnit (unit) {
    let self = this;
    let unitIndex = self.units.indexOf(unit);

    if (typeof unit !== 'undefined' && unitIndex >= 0) {

        return specifyUnit(self.value, self.step, self.units,
            (value, index) => index < unitIndex);

    }

    return null;
}

function specifyUnit (value, step, units, goOn) {
    let index = 0;
    let maxIndex = units.length - 1;

    while (index < maxIndex) {

        if (goOn && goOn(value, index) === false) {
            break;
        }

        value = value / step;
        index += 1;
    }

    return {
        number: value,
        unit: units[index] || ''
    };
}

function creator (value, step, units) {
    return new Unitage(value, step, units);
}

creator.Constructor = Unitage;

module.exports = creator;
