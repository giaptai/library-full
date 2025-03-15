import { useEffect, useState } from "react";
import Book from "../../models/Book.model";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { SearchBook } from "./SearchBook";
import { Pagination } from "../Utils/Pagination";

export const SearchBooksPage = () => {

    const [books, setBooks] = useState<Book[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    const [currPage, setCurrPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(5);
    const [totalAmountOfBooks, setTotalAmountOfBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    // search
    const [search, setSearch] = useState('');
    const [searchUrL, setSearchUrl] = useState('');
    //category
    const [categorySelection, setCategorySelection] = useState('Book category');


    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = import.meta.env.VITE_API_BOOKS_URL;
            let url: string = ``;

            if (searchUrL === '') {
                url = `${baseUrl}?page=${currPage - 1}&size=${booksPerPage}&projection=bookView`;
            } else {
                let searchWithPage = searchUrL.replace('<pageNumber>', `${currPage - 1}`);
                url = baseUrl + searchWithPage;
            }

            const res = await fetch(url);
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
                });
            }
            // set time for show loading :))
            // setTimeout(() => {
            //     setBooks(loadedBooks);
            //     setIsLoading(false);
            // }, 3000);
            setBooks(loadedBooks);
            setIsLoading(false);
        };
        fetchBooks()
            .catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })

        // Custom scroll animation to the top with duration
        const scrollToTop = (duration: number) => {
            const startY = window.scrollY;
            const startTime = performance.now();

            const animateScroll = (currentTime: number) => {
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / duration, 1); // Ensure progress is capped at 1
                const scrollY = startY * (1 - progress);

                window.scrollTo(0, scrollY);

                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };

            requestAnimationFrame(animateScroll);
        };
        scrollToTop(777);
        // this mean each time useEffect gets kicked off, 
        // we are going to scroll the page to the top
        // window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [currPage, searchUrL]);

    if (isLoading) {
        return (
            <SpinnerLoading />
        );
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const searchHandleChange = () => {
        setCurrPage(1);
        if (search === '') {
            setSearchUrl('');
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}&projection=bookView`)
        }
        setCategorySelection('Book category'); //search at search bar reset category selection
    }

    const categoryField = (value: string) => {
        setCurrPage(1);
        if (value.toLowerCase() === 'fe' || value.toLowerCase() === 'be' ||
            value.toLowerCase() === 'data' || value.toLowerCase() === 'devops') {
            setCategorySelection(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}&projection=bookView`)
        } else {
            setCategorySelection('All');
            setSearchUrl(`?page=<pageNumber>&size=${booksPerPage}&projection=bookView`);
        }
    }

    const indexOfLastBook: number = currPage * booksPerPage;
    const indexOfFirstBook: number = indexOfLastBook - booksPerPage;
    let lastItem: number = booksPerPage * currPage <= totalAmountOfBooks ? booksPerPage * currPage : totalAmountOfBooks;

    const paginate = (pageNumber: number) => setCurrPage(pageNumber);

    return (
        <section>
            <div className='container'>
                <div>
                    <div className='row mt-5'>
                        <div className='col-6'>
                            <div className='d-flex'>
                                <input className='form-control me-2' type='search'
                                    placeholder='Search' aria-labelledby='Search'
                                    onChange={e => setSearch(e.target.value)}
                                />
                                <button className='btn btn-outline-success'
                                    onClick={() => searchHandleChange()}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className='col-4'>

                            <div className='dropdown'>
                                <button className='btn btn-secondary dropdown-toggle' type='button'
                                    data-bs-toggle='dropdown' aria-expanded='false'>
                                    {categorySelection}
                                    {/* Category */}
                                </button>
                                <ul className='dropdown-menu'>
                                    <li onClick={() => categoryField('All')}><a className='dropdown-item' href='#'>All</a></li>
                                    <li onClick={() => categoryField('fe')}><a className='dropdown-item' href='#'>Front End</a></li>
                                    <li onClick={() => categoryField('be')}><a className='dropdown-item' href='#'>Back End</a></li>
                                    <li onClick={() => categoryField('data')}><a className='dropdown-item' href='#'>Data</a></li>
                                    <li onClick={() => categoryField('devops')}><a className='dropdown-item' href='#'>DevOps</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {totalAmountOfBooks > 0 ?
                        <>
                            <div className='mt-3'>
                                <h5>Number of results: ({totalAmountOfBooks})</h5>
                            </div>
                            <p>
                                {indexOfFirstBook + 1} to {lastItem} of {totalAmountOfBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </> :
                        <div className="m-5">
                            <h3>Can't find what you are looking for ?</h3>
                            <a type="button" className="btn btn-md px-4 me-md-2 text-white" href="#" style={{ background: '#7431fa' }}>Library Services</a>
                        </div>
                    }
                    {totalPages > 1 && <Pagination currPage={currPage} totalPages={totalPages} paginate={paginate} />}
                </div>
            </div>
        </section>
    );
}