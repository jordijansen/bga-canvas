/**
 *------
 * BGA framework: © Gregory Isabelli <gisabelli@boardgamearena.com> & Emmanuel Colin <ecolin@boardgamearena.com>
 * earth implementation : © Guillaume Benny bennygui@gmail.com
 *
 * This code has been produced on the BGA studio platform for use on http://boardgamearena.com.
 * See http://en.boardgamearena.com/#!doc/Studio for more information.
 * -----
 */
class Numbers {
    DELAY: 100;
    STEPS: 5;

    private currentValue;
    private targetValue;
    private onFinishStepValues;
    constructor(private game: Game, initialValue = 0, private targetIdsOrElements = []) {
        this.currentValue = initialValue;
        this.targetValue = initialValue;
        this.onFinishStepValues = [];
        this.ensureNumbers();
        this.update();
    }

    addTarget(targetIdOrElement) {
        if (this.targetIdsOrElements instanceof Array) {
            this.targetIdsOrElements.push(targetIdOrElement);
        } else {
            this.targetIdsOrElements = [this.targetIdsOrElements, targetIdOrElement];
        }
        this.update();
    }

    registerOnFinishStepValues(callback) {
        this.onFinishStepValues.push(callback);
    }

    getValue() {
        return this.currentValue;
    }

    setValue(value) {
        this.currentValue = value;
        this.targetValue = value;
        this.ensureNumbers();
        this.update();
    }

    toValue(value, isInstantaneous = false) {
        if (isInstantaneous || this.game.instantaneousMode) {
            this.setValue(value);
        } else {
            this.targetValue = value;
            this.ensureNumbers();
            this.stepValues(true);
        }
    }

    stepValues(firstCall = false) {
        if (this.currentAtTarget()) {
            this.update();
            if (!firstCall) {
                for (const callback of this.onFinishStepValues) {
                    callback(this);
                }
            }
            return;
        }
        if (this.currentValue instanceof Array) {
            const newValues = [];
            for (let i = 0; i < this.currentValue.length; ++i) {
                newValues.push(this.stepOneValue(this.currentValue[i], this.targetValue[i]));
            }
            this.currentValue = newValues;
        } else {
            this.currentValue = this.stepOneValue(this.currentValue, this.targetValue);
        }
        this.update();
        setTimeout(() => this.stepValues(), this.DELAY);
    }

    stepOneValue(current, target) {
        if (current === null) {
            current = 0;
        }
        if (target === null) {
            return null;
        }
        const step = Math.ceil(Math.abs(current - target) / this.STEPS);
        return (current + (current < target ? 1 : -1) * step);
    }

    update() {
        if (this.targetIdsOrElements instanceof Array) {
            for (const target of this.targetIdsOrElements) {
                this.updateOne(target);
            }
        } else {
            this.updateOne(this.targetIdsOrElements);
        }
    }

    updateOne(targetIdOrElement) {
        const elem = this.getElement(targetIdOrElement);
        elem.innerHTML = this.format();
    }

    getTargetElements() {
        if (this.targetIdsOrElements instanceof Array) {
            return this.targetIdsOrElements.map((id) => this.getElement(id));
        } else {
            return [this.getElement(this.targetIdsOrElements)];
        }
    }

    getTargetElement() {
        const elems = this.getTargetElements();
        if (elems.length == 0) {
            return null;
        }
        return elems[0];
    }

    format() {
        if (this.currentValue instanceof Array) {
            const formatted = [];
            for (let i = 0; i < this.currentValue.length; ++i) {
                formatted.push(this.formatOne(this.currentValue[i], this.targetValue[i]));
            }
            return this.formatMultiple(formatted);
        } else {
            return this.formatOne(this.currentValue, this.targetValue);
        }
    }

    formatOne(currentValue, targetValue) {
        const span = document.createElement('span');
        if (currentValue != targetValue) {
            span.classList.add('bx-counter-in-progress');
        }
        span.innerText = (currentValue === null ? '-' : currentValue);
        return span.outerHTML;
    }

    formatMultiple(formattedValues) {
        return formattedValues.join('/');
    }

    ensureNumbers() {
        if (this.currentValue instanceof Array) {
            this.currentValue = this.currentValue.map((v) => this.ensureOneNumber(v));
            this.targetValue = this.targetValue.map((v) => this.ensureOneNumber(v));
        } else {
            this.currentValue = this.ensureOneNumber(this.currentValue);
            this.targetValue = this.ensureOneNumber(this.targetValue);
        }
    }

    ensureOneNumber(value) {
        return (value === null ? null : parseInt(value));
    }

    currentAtTarget() {
        if (this.currentValue instanceof Array) {
            return this.currentValue.every((v, i) => v == this.targetValue[i]);
        } else {
            return (this.currentValue == this.targetValue);
        }
    }

    getElement(targetIdOrElement) {
        if (typeof targetIdOrElement == "string") {
            return document.getElementById(targetIdOrElement);
        }
        return targetIdOrElement;
    }
}