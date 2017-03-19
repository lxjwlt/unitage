/**
 * @file unitage class
 */

'use strict';

class Unitage {

    constructor (value, units, step) {
        let self = this;

        if (step === 0) {
            throw('Expected step to be none-zero number.');
        }

        self.value = value;

        initUnits.call(self, units, step);

        self.tryUnit();
    }

    setUnit (unit) {
        let self = this;
        let result = byUnit.call(self, unit);

        if (result) {
            self.unit = result.unit;
            self.number = result.number;
        }
    }

    setValue (value) {
        let self = this;

        self.value = value;

        self.tryMaxUnit();
    }

    setNumber (number) {
        let self = this;

        self.number = number;

        self.value = number;

        for (let unitConfig of self.units) {
            self.value = self.value * unitConfig.step;

            if (unitConfig.unit === self.unit) {
                break;
            }
        }
    }

    tryUnit (unit) {
        let self = this;

        let value = self.value;

        if (!self.units.length) {
            self.number = self.value;
            self.unit = '';
            return;
        }

        let unitConfig = self.unitMap[unit] || self.units[self.units.length - 1];

        let maxIndex = unitConfig.index;

        let targetUnit = self.units.filter((config, i) => {
            let nextConfig = self.units[i + 1];

            return value >= config.step && (!nextConfig || value < nextConfig.step) && i <= maxIndex ||
                maxIndex === i && value >= config.step;
        })[0];

        targetUnit = targetUnit || self.units[0];

        self.number = value / targetUnit.step;
        self.unit = targetUnit.unit;
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

function checkUnits (units, step) {
    let map = {};

    for (let i = 0; i < units.length; i++) {
        let config = units[i];

        if (i === 0 && typeof config !== 'string' && config.step !== 1) {
            throw('The step of first unit should be 1.');
        }

        if (typeof config === 'string') {
            if (!step) {
                throw('Step should Be number when unit is string.');
            }

            config = {
                unit: config
            };
        }

        if (typeof config.unit !== 'string') {
            throw('Expect unit to be string.');
        }

        if (map[config.unit]) {
            throw('Unexpected multiple same unit.');
        }

        map[config.unit] = true;
    }
}

function initUnits (units, step) {
    let self = this;
    let lastStep = 1;

    checkUnits(units, step);

    self.unitMap = {};

    self.units = units.map((unit, i) => {
        let config = unit;

        if (typeof unit === 'string') {
            if (!step) {
                throw('Step should Be number when unit is string.');
            }

            config = {
                unit: unit,
                step: i === 0 ? 1 : step
            };
        }

        if (self.unitMap[config.unit]) {
            throw('Unexpected multiple same unit.');
        }

        config = Object.assign({}, config, {
            index: i,
            step: config.step * lastStep
        });

        self.unitMap[config.unit] = config;

        lastStep = config.step;

        return config;
    });
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

function unitize (value, units, goOn) {
    let index = 0;
    let maxIndex = units.length - 1;

    while (index < maxIndex) {
        let config = units[index];

        if (goOn && goOn(value, index, config) === false) {
            break;
        }

        value = value / config.step;
        index += 1;
    }

    return {
        number: value,
        unit: units[index] || ''
    };
}

function specifyUnit (value, units, goOn) {
    let index = 0;
    let maxIndex = units.length - 1;

    while (index < maxIndex) {
        let config = units[index];

        if (goOn && goOn(value, index, config) === false) {
            break;
        }

        value = value / config.step;
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
