class CarFactory {
    constructor() {
        this.cars = [];
    }

    guaranteeSimulation (year) {
        let totalCars = this.cars.length;
        for (let i=0;i<totalCars;i++) {
            let yearActive = this.cars[i].yearCreated;
            let guaranteePeriod = this.cars[i].guaranteePeriod;
            let numTyre = this.cars[i].newTyre.numTyre;
            let numDoors = this.cars[i].numDoors;
            let numSeats = this.cars[i].numSeats;
            let varian = this.cars[i].carVarian;
            let expired = "";
            let expiredValidity = parseInt(yearActive) + parseInt(guaranteePeriod) - parseInt(year);
            if (expiredValidity >= 0) {
                if (parseInt(year) < parseInt(yearActive)) {
                    expired = "no valid";
                } else {
                    expired = "no";
                }
            } else {
                expired = "yes";
            }
            console.log({"Year Active": yearActive,
                        "Guarantee Period": guaranteePeriod,
                        "Num Tyre": numTyre,
                        "Num Doors": numDoors,
                        "Num Seats": numSeats,
                        "Varian": varian,
                        "Expired Status": expired});
        }
    }

    produce (varian,year) {
        let numCars = CarFactory.randomInit(1,10);
        for (let i=0;i<numCars;i++) {
            let guaranteePeriod = CarFactory.randomInit(1,10);
            let numTyre = CarFactory.randomInit(4,8);
            let numDoors = CarFactory.randomInit(4,8);
            let numSeats = CarFactory.randomInit(4,8);
            switch (varian) {
                case "Innova":
                    this.cars.push(new Innova(year,guaranteePeriod,numTyre,numDoors,numSeats));
                    break;
                case "Avanza":
                    this.cars.push(new Avanza(year,guaranteePeriod,numTyre,numDoors,numSeats));
                    break;
                case "Agya":
                    this.cars.push(new Agya(year,guaranteePeriod,numTyre,numDoors,numSeats));
                    break;
            }
        }

    }

    static randomInit(min,max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

    static currentYear() {
        const date = new Date();
        return date.getYear() + 1900;
    }
}

class Car {
    constructor(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats) {
        this._yearCreated = yearCreated;
        this._guaranteePeriod = guaranteePeriod;
        this._newTyre = new Tyre(numTyre);
        this._numDoors = numDoors;
        this._numSeats = numSeats;
    }

    get yearCreated() {
        return this._yearCreated;
    }

    get guaranteePeriod() {
        return this._guaranteePeriod;
    }

    get newTyre() {
        return this._newTyre;
    }

    get numDoors() {
        return this._numDoors;
    }

    get numSeats() {
        return this._numSeats;
    }
}

class Innova extends Car {
    constructor(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats) {
        super(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats);
        this._carVarian = "innova";
    }

    get carVarian() {
        return this._carVarian;
    }
}

class Avanza extends Car {
    constructor(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats) {
        super(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats);
        this._carVarian = "avanza";
    }

    get carVarian() {
        return this._carVarian;
    }
}

class Agya extends Car {
    constructor(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats) {
        super(yearCreated,guaranteePeriod,numTyre,numDoors,numSeats);
        this._carVarian = "agya";
    }

    get carVarian() {
        return this._carVarian;
    }
}

class Tyre {
    constructor(numTyre) {
        this._numTyre = numTyre;
    }

    get numTyre() {
        return this._numTyre;
    }
}

// console.log(CarFactory.currentYear());
// console.log(CarFactory.randomInit(1,10));
let toyota = new CarFactory();
toyota.produce('Innova', '2019');
toyota.produce('Avanza', '2019');
toyota.produce('Agya', '2019');
toyota.guaranteeSimulation('2023');
