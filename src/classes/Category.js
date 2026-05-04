export default class Category {
    #category;
    #amount;

    constructor(category, amount) {
        this.#category = category;
        this.#amount = amount;

        this.getCategory =  this.getCategory.bind(this);
        this.getAmount = this.getAmount.bind(this);
        this.setCategory = this.setCategory.bind(this);
        this.setAmount = this.setAmount.bind(this);
    }

    getCategory() {
        return this.#category;
    }

    getAmount() {
        return this.#amount;
    }

    setCategory(category){
        this.#category = category
    }

    setAmount(amount){
        this.#amount = amount;
    }
}
