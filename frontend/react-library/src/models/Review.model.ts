class Review {

    constructor(public id: number, public userEmail: string, public date: Date,
        public rating: number, public book_id: number, public reviewDescription?: string) {
        this.id = id;
        this.userEmail = userEmail;
        this.date = date;
        this.rating = rating;
        this.book_id = book_id;
        this.reviewDescription = reviewDescription;
    }
}

export default Review;