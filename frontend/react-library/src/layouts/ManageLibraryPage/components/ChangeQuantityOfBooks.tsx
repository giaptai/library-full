import { useEffect, useState } from "react";
import Book from "../../../models/Book.model";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ChangeQuantityOfBook } from "./ChangeQuantityOfBook";

export const ChangeQuantityOfBooks = () => {
    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [currPage, setCurrPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // re-render when deletes book
    const [bookDelete, setBookDelete] = useState<boolean>(false);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `${import.meta.env.VITE_API_BOOKS_URL}?page=${currPage - 1}&size=${booksPerPage}&projection=bookView`;
            const res = await fetch(baseUrl);
            if (!res.ok) {
                throw new Error("Something went wrong!");
            }
            const resJson = await res.json();
            const resData = resJson._embedded.books;

            setTotalAmountOfBooks(resJson.page.totalElements);
            setTotalPages(resJson.page.totalPages);

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
                } as Book);
            }
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks()
            .catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })
    }, [currPage, bookDelete]);

    const indexOfLastBook: number = currPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem: number = booksPerPage * currPage <= totalAmountOfBooks ? booksPerPage * currPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrPage(pageNumber);

    const deleteBook = () => setBookDelete(!bookDelete);

    if (isLoading === true) {
        return <SpinnerLoading />
    }

    if (httpError !== null) {
        return <div className="container m-5"><p>{httpError}</p></div>
    }

    return <div className='container mt-5'>
        {totalAmountOfBooks > 0 ?
            <>
                <div className='mt-3'>
                    <h3>Number of results: ({totalAmountOfBooks})</h3>
                </div>
                <p>
                    {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                </p>
                {books.map(book => (
                    <ChangeQuantityOfBook book={book} key={book.id} deleteBook={deleteBook} />
                ))}
            </>
            :
            <h5>Add a book before changing quantity</h5>
        }
        {totalPages > 1 && <Pagination currPage={currPage} totalPages={totalPages} paginate={paginate} />}
    </div>;
}