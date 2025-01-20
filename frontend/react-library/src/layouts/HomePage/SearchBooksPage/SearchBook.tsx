import { Link } from "react-router-dom";
import Book from "../../../models/Book";

//export const SearchBook = (props: { book: Book }) 
// dùng cách này cho biet props la 1 doi tuong co thuoc tinh book kieu du lieu Book

export const SearchBook: React.FC<{ book: Book }> = (props) => {
    return (
        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
            <div className='row g-0'>
                <div className='col-md-2'>
                    <div className='d-none d-lg-block'>
                        {
                            // check img is null or not
                            //So sánh nghiêm ngặt (strict inequality). 
                            // Nó kiểm tra cả giá trị và kiểu dữ liệu. 
                            // Điều này có nghĩa là props.book.img phải 
                            // có giá trị khác null và phải có kiểu dữ liệu khác null.
                            props.book.img !== null ?
                                <img src={props.book.img}
                                    className="img-fluid rounded-start" alt='Book' />
                                :
                                <img src={'src/Images/BooksImages/book-luv2code-1000.png'}
                                    className="img-fluid rounded-start" alt='Book' />
                        }
                    </div>
                    {/* Mobile version */}
                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                        {props.book.img ?
                            <img src={props.book.img} width='123' height='196' alt='Book'
                            /> :
                            <img src={'src/Images/BooksImages/book-luv2code-1000.png'}
                                width='123' height='196' alt='Book'
                            />}
                    </div>
                </div>
                <div className='col-md-8'>
                    <div className='card-body'>
                        <h5 className='card-title'>{props.book.author}</h5>
                        <h4>{props.book.title}</h4>
                        <p className='card-text'>{props.book.description}</p>
                    </div>
                </div>
                <div className='col-md-2 d-flex justify-content-center align-items-center'>
                    <Link className='btn btn-md main-color text-white' to={`/checkout/${props.book.id}`}>
                        View Details
                    </Link>
                </div>
            </div>
        </div>
    );
}