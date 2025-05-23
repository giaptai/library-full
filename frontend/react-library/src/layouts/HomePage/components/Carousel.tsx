import { ReturnBook } from "./ReturnBook";
import { useState, useEffect } from "react";
import Book from "../../../models/Book.model";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const Carousel = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // call a function
    //useEffect calls the first time at the beginning of the creation of the component
    //then will call each time something in this array changes
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = import.meta.env.VITE_API_BOOKS_URL;
            const url: string = `${baseUrl}?page=0&size=9&projection=bookView`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Something went wrong!");
            }
            const resJson = await res.json();
            const resData = resJson._embedded.books;

            const loadedBooks: Book[] = [];

            for (const key in resData) {
                loadedBooks.push({
                    id: resData[key].id,
                    title: resData[key].title,
                    author: resData[key].author,
                    description: resData[key].description,
                    copies: resData[key].copies,
                    copiesAvailable: resData[key].copiesAvailable,
                    category: resData[key].category,
                    img: resData[key].img,
                });
            }
            // set time for show loading :))
            setTimeout(() => {
                setBooks(loadedBooks);
                setIsLoading(false);
            }, 1000);
        };
        fetchBooks()
            .catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })
    }, []);

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }
    if (httpError !== null) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }
    return (
        <section className="container mt-5" style={{ height: 550 }}>
            <div className="homepage-carousel-title">
                <h3>Find your next "One day or day one"</h3>
            </div>
            <div id="carouselExampleControls"
                className="carousel carousel-dark slide mt-5 d-none d-lg-block"
                data-bs-interval='false'>
                {/* Desktop */}
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(0, 3).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(3, 6).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                    <div className="carousel-item">
                        <div className="row d-flex justify-content-center align-items-center">
                            {books.slice(6, 9).map(book => (
                                <ReturnBook book={book} key={book.id} />
                            ))}
                        </div>
                    </div>
                </div>
                <button className="carousel-control-prev" type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next" type="button"
                    data-bs-target="#carouselExampleControls"
                    data-bs-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Next</span>
                </button>
            </div>

            {/* Mobile */}
            <div className="d-lg-none mt-3">
                <div className="row d-flex justify-content-center align-items-center">
                    <ReturnBook book={books[0]} key={books[0]?.id} />
                </div>
            </div>
            <div className="homepage-carousel-title mt-3">
                <Link className="btn btn-outline-secondary btn-lg" to="/search">View more</Link>
            </div>
        </section>
    );
}