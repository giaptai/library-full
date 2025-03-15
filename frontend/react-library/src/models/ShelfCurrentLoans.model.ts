import Book from "./Book.model";

class ShelfCurrentLoans {
    constructor(public book: Book, public daysLeft: number) {
        this.book = book;
        this.daysLeft = daysLeft;
    }
}

export default ShelfCurrentLoans;