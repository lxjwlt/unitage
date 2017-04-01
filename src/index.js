/**
 * @file unitage class
 */

'use strict';

class Unitage {

    constructor (value, units, step) {
        let self = this;

        checkStep(step);
        checkUnits(units, step);

        self.value = value;

        initUnits.call(self, units, step);

        self.tryUnit();
    }

    setUnit (unit) {
        let self = this;
        let targetUnit = self.unitMap[unit];

        if (targetUnit) {
            self.unit = targetUnit.unit;
            self.number = self.value / targetUnit.step;
        }
    }

    setValue (value) {
        let self = this;

        self.value = value;

        let targetUnit = self.unitMap[self.unit];

        self.number = self.value / targetUnit.step;
    }

    setNumber (number) {
        let self = this;

        self.number = number;

        let targetUnit = self.unitMap[self.unit];

        self.value = self.number * targetUnit.step;
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
            let absValue = Math.abs(value);

            return absValue >= config.step && (!nextConfig || absValue < nextConfig.step) && i <= maxIndex ||
                maxIndex === i && absValue >= config.step;
        })[0];

        targetUnit = targetUnit || self.units[0];

        self.number = value / targetUnit.step;
        self.unit = targetUnit.unit;
    }

    getNumber (unit, maxDigits) {
        let self = this;

        if (typeof unit === 'number') {
            maxDigits = unit;
            unit = null;
        }

        let targetUnit = self.unitMap[unit];

        maxDigits = !maxDigits && maxDigits !== 0 ? Infinity : maxDigits;

        let number = targetUnit ? self.value / targetUnit.step : self.number;

        return round(number, maxDigits);
    }

    toString (unit, maxDigits) {
        let self = this;

        if (typeof unit === 'number') {
            maxDigits = unit;
            unit = null;
        }

        let targetUnit = self.unitMap[unit];

        maxDigits = !maxDigits && maxDigits !== 0 ? 2 : maxDigits;

        return targetUnit ?
            round(self.value / targetUnit.step, maxDigits) + targetUnit.unit :
            round(self.number, maxDigits) + self.unit;
    }

}

function checkStep (step) {

    if (!step && step !== 0) {
        return;
    }

    if (Math.floor(step) !== step) {
        throw('Expect step to be integer.');
    }

    if (step <= 0) {
        throw('Expected step to be Integer greater than 0.');
    }
}

function round (value, digits) {

    if (digits > 17) {
        return value;
    }

    let num = Math.pow(10, digits);

    return Math.round(value * num) / num;
}

function checkUnit (unit) {
    if (typeof unit !== 'string') {
        throw('Expect unit to be string.');
    }
}

function checkUnits (units, step) {
    let map = {};

    for (let i = 0; i < units.length; i++) {
        let config = units[i];

        if (i === 0 && typeof config === 'object' && config.step !== 1) {
            throw('The step of first unit should be 1.');
        }

        if (typeof config === 'string') {
            if (!step && step !== 0) {
                throw('Step should Be number when unit is string.');
            }

            config = {
                unit: config,
                step: step
            };
        }

        checkStep(config.step);

        checkUnit(config.unit);

        if (map[config.unit]) {
            throw('Unexpected multiple same unit.');
        }

        map[config.unit] = true;
    }
}

function initUnits (units, step) {
    let self = this;
    let lastStep = 1;

    self.unitMap = {};

    self.units = units.map((unit, i) => {
        let config = unit;

        if (typeof unit === 'string') {
            config = {
                unit: unit,
                step: i === 0 ? 1 : step
            };
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

function creator (value, units, step) {
    return new Unitage(value, units, step);
}

creator.define = function (units, step) {
    return function (value) {
        return new Unitage(value, units, step);
    }
};

creator.Constructor = Unitage;

module.exports = creator;
