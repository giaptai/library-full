import { Link } from "react-router-dom";
import Book from "../../../models/Book.model";
import defaultImg from "../../../Images/BooksImages/no-image.png"

export const ReturnBook: React.FC<{ book: Book }> = (props) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.book?.img ?
                    <img src={props.book.img} alt="book"
                        width='151' height='233' /> :
                    <img src={defaultImg}
                        alt="book" width='151' height='233' />
                }
                <h6 className="mt-2">{props.book?.title}</h6>
                <p>{props.book?.author}</p>
                <Link className="btn main-color text-white" to={`checkout/${props.book?.id}`} >Reserve</Link>
            </div>
        </div>
    );
}