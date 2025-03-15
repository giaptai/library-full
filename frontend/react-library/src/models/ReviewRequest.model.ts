class ReviewRequest {

    constructor(
        public rating: number,
        public bookId: number,
        public reviewDescription?: string) {
        this.rating = rating;
        this.bookId = bookId;
        this.reviewDescription = reviewDescription;
    }
}

export default ReviewRequest;