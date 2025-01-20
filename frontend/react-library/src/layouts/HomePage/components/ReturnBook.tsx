import Book from "../../../models/Book";

export const ReturnBook: React.FC<{ book: Book }> = (props) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.book.img ?
                    <img src={props.book.img} alt="book"
                        width='151' height='233' /> :
                    <img src={'src/Images/BooksImages/book-luv2code-1000.png'}
                        alt="book" width='151' height='233' />
                }
                <h6 className="mt-2">{props.book.title}</h6>
                <p>{props.book.author}</p>
                <a className="btn main-color text-white" href="#" >Reserve</a>
            </div>
        </div>
    );
}