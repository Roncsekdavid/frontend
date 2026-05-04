export default class Offer {
    #id;
    #item_id;
    #loan_amount;
    #interest_rate;
    #offer_code;
    #status;
    #created_at;
    #expires_at;
    #item;

    constructor(id, item_id, loan_amount, interest_rate, offer_code, status, created_at, expires_at, item) {
        this.#id = id;
        this.#item_id = item_id;
        this.#loan_amount = loan_amount;
        this.#interest_rate = interest_rate;
        this.#offer_code = offer_code;
        this.#status = status;
        this.#created_at = created_at;
        this.#expires_at = expires_at;
        this.#item = item;

        this.getId = this.getId.bind(this);
        this.getItemId = this.getItemId.bind(this);
        this.getLoanAmount = this.getLoanAmount.bind(this);
        this.getInterestRate = this.getInterestRate.bind(this);
        this.getOfferCode = this.getOfferCode.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getCreatedAt = this.getCreatedAt.bind(this);
        this.getExpiresAt = this.getExpiresAt.bind(this);

        this.setStatus = this.setStatus.bind(this);
        this.setExpiresAt = this.setExpiresAt.bind(this);
    }

    getId() {
        return this.#id;
    }

    getItemId() {
        return this.#item_id;
    }

    getLoanAmount() {
        return this.#loan_amount;
    }

    getInterestRate() {
        return this.#interest_rate;
    }

    getOfferCode() {
        return this.#offer_code;
    }

    getStatus() {
        return this.#status;
    }

    getCreatedAt() {
        return this.#created_at;
    }

    getExpiresAt() {
        return this.#expires_at;
    }

    getItem() {
        return this.#item;
    }

    getItemId() {
        return this.#item_id
    }

    setStatus(status) {
        this.#status = status;
    }

    setExpiresAt(expires_at) {
        this.#expires_at = expires_at;
    }
}