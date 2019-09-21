const Pi = 22 / 7;

class MesinHitung {
    constructor() {
        this.x = 1;
    }

    add(number) {
        this.x += number;
        return this;
    }

    subtract(number) {
        this.x -= number;
        return this;
    }

    multiply(number) {
        this.x *= number;
        return this;
    }

    divide(number) {
        this.x /= number;
        return this;
    }

    exponent(number) {
        this.x = this.x ** number;
        return this;
    }

    square() {
        this.x = this.x ** 2;
        return this;
    }

    squareRoot() {
        this.x = Math.sqrt(this.x);
        return this;
    }

    result() {
        console.log(this.x);
    }
}

export {MesinHitung,Pi};
