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
            return index < maxIndex;
        });

        self.number = result.number;
        self.unit = result.unit;
    }

    toString (unit) {
        let self = this;
        let unitIndex = self.units.indexOf(unit);

        if (typeof unit !== 'undefined' && unitIndex >= 0) {

            let result = specifyUnit(self.value, self.step, self.units,
                (value, index) => index < unitIndex);

            return result.number + result.unit;
        }

        return self.number + self.unit;
    }
}

function specifyUnit (value, step, units, goOn) {
    let index = 0;

    while (value >= step && index < units.length) {

        if (goOn && goOn(value, index) === false) {
            break;
        }

        value = value / step;
        index += 1;
    }

    return {
        number: value,
        unit: units[index]
    };
}

function creator (value, step, units) {
    return new Unitage(value, step, units);
}

creator.Constructor = Unitage;

module.exports = creator;
