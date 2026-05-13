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
    #note;

    constructor(id, item_id, loan_amount, interest_rate, offer_code, status, created_at, expires_at, item, note = null) {
        this.#id = id;
        this.#item_id = item_id;
        this.#loan_amount = loan_amount;
        this.#interest_rate = interest_rate;
        this.#offer_code = offer_code;
        this.#status = status;
        this.#created_at = created_at;
        this.#expires_at = expires_at;
        this.#item = item;
        this.#note = note;

        this.getId = this.getId.bind(this);
        this.getItemId = this.getItemId.bind(this);
        this.getLoanAmount = this.getLoanAmount.bind(this);
        this.getInterestRate = this.getInterestRate.bind(this);
        this.getOfferCode = this.getOfferCode.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getCreatedAt = this.getCreatedAt.bind(this);
        this.getExpiresAt = this.getExpiresAt.bind(this);
        this.getItem = this.getItem.bind(this);
        this.getNote = this.getNote.bind(this);
        this.setStatus = this.setStatus.bind(this);
        this.setExpiresAt = this.setExpiresAt.bind(this);
    }

    getId() { return this.#id; }
    getItemId() { return this.#item_id; }
    getLoanAmount() { return this.#loan_amount; }
    getInterestRate() { return this.#interest_rate; }
    getOfferCode() { return this.#offer_code; }
    getStatus() { return this.#status; }
    getCreatedAt() { return this.#created_at; }
    getExpiresAt() { return this.#expires_at; }
    getItem() { return this.#item; }
    getNote() { return this.#note; }

    setStatus(status) { this.#status = status; }
    setExpiresAt(expires_at) { this.#expires_at = expires_at; }

    static fromApi(data) {
        return new Offer(
            data.id,
            data.item_id,
            data.loan_amount,
            data.interest_rate,
            data.offer_code,
            data.status,
            data.created_at,
            data.expires_at,
            data.items ?? null,
            data.note ?? null
        )
    }
}