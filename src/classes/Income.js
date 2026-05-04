export default class Income {
    #date;
    #income;

    constructor(date, income) {
        this.#date = date;
        this.#income = income;

        this.getDate =  this.getDate.bind(this);
        this.getIncome = this.getIncome.bind(this);
        this.setDate = this.setDate.bind(this);
        this.setIncome = this.setIncome.bind(this);
    }

    getDate() {
        return this.#date;
    }

    getIncome() {
        return this.#income;
    }

    setDate(date){
        this.#date = date
    }

    setIncome(income){
        this.#income = income;
    }
}
