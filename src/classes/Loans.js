export default class Loans {
    #id;
    #offer_id;
    #principal_amount;
    #start_date;
    #due_date;
    #created_at;
    #status;
    #note;
    #duration_months;
    #interest_rate;
    #default_reason;
    #penalty_interest_rate;

    constructor(
        id,
        offer_id,
        principal_amount,
        start_date,
        due_date,
        created_at,
        status,
        note,
        duration_months,
        interest_rate,
        default_reason = null,
        penalty_interest_rate = 0
    ) {
        this.#id = id;
        this.#offer_id = offer_id;
        this.#principal_amount = principal_amount;
        this.#start_date = start_date;
        this.#due_date = due_date;
        this.#created_at = created_at;
        this.#status = status;
        this.#note = note;
        this.#duration_months = duration_months;
        this.#interest_rate = interest_rate;
        this.#default_reason = default_reason;
        this.#penalty_interest_rate = penalty_interest_rate;

        this.getId = this.getId.bind(this);
        this.getOfferId = this.getOfferId.bind(this);
        this.getPrincipalAmount = this.getPrincipalAmount.bind(this);
        this.getStartDate = this.getStartDate.bind(this);
        this.getDueDate = this.getDueDate.bind(this);
        this.getCreatedAt = this.getCreatedAt.bind(this);
        this.getStatus = this.getStatus.bind(this);
        this.getNote = this.getNote.bind(this);
        this.getDurationMonths = this.getDurationMonths.bind(this);
        this.getInterestRate = this.getInterestRate.bind(this);
        this.getDefaultReason = this.getDefaultReason.bind(this);
        this.getPenaltyInterestRate = this.getPenaltyInterestRate.bind(this);
    }

    getId() { return this.#id; }
    getOfferId() { return this.#offer_id; }
    getPrincipalAmount() { return this.#principal_amount; }
    getStartDate() { return this.#start_date; }
    getDueDate() { return this.#due_date; }
    getCreatedAt() { return this.#created_at; }
    getStatus() { return this.#status; }
    getNote() { return this.#note; }
    getDurationMonths() { return this.#duration_months; }
    getInterestRate() { return this.#interest_rate; }
    getDefaultReason() { return this.#default_reason; }
    getPenaltyInterestRate() { return this.#penalty_interest_rate; }

    static fromApi(data) {
        return new Loans(
            data.id,
            data.offer_id,
            data.principal_amount,
            data.start_date,
            data.due_date,
            data.created_at,
            data.status,
            data.note,
            data.duration_months,
            data.interest_rate,
            data.default_reason,
            data.penalty_interest_rate
        );
    }
}