import { useEffect, useState } from "react";
import Book from "../../models/Book.model";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import Review from "../../models/Review.model";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import ReviewRequest from "../../models/ReviewRequest.model";

export const BookCheckoutPage = () => {
    const { authState } = useOktaAuth();
    const [book, setBook] = useState<Book>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //review state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);

    // review state left
    const [isReviewLeft, setIsReviewLeft] = useState<boolean>(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Loans Count State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    // Is Book Check Out
    const [isCheckedOut, setIsCheckedOut] = useState(false);
    const [isLoadingBookCheckedOut, setIsLoadingBookCheckedOut] = useState(true);

    //Payment
    const [displayError, setDisplayError] = useState(false);

    //this variable is going to be used to grab the path parameter out of the URL
    const bookId: number = Number((window.location.pathname).split('/')[2]);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = import.meta.env.VITE_API_BOOKS_URL;
            const url: string = `${baseUrl}/${bookId}?projection=bookView`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Something went wrong!");
            }
            const resJson = await res.json();

            const loadedBook: Book = {
                id: resJson.id,
                title: resJson.title,
                author: resJson.author,
                description: resJson.description,
                copies: resJson.copies,
                copiesAvailable: resJson.copiesAvailable,
                category: resJson.category,
                img: resJson.img,
            };

            // set time for show loading :))
            setTimeout(() => {
                setBook(loadedBook);
                setIsLoading(false);
            }, 1000);
        };
        fetchBooks()
            .catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })
    }, [isCheckedOut]);

    // fetch book reviews
    useEffect(() => {
        const fetchBookReviews = async () => {
            const baseUrl: string = import.meta.env.VITE_API_REVIEW_URL;
            const url: string = `${baseUrl}/search/findByBookId?bookId=${bookId}&projection=reviewView`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Something went wrong!");
            }
            const resJson = await res.json();
            const resData = resJson._embedded.reviews;

            const loadedReviews: Review[] = [];

            let weightedStarReviews: number = 0;

            for (const key in resData) {
                loadedReviews.push({
                    id: resData[key].id,
                    userEmail: resData[key].userEmail,
                    date: resData[key].date,
                    book_id: resData[key].bookId,
                    rating: resData[key].rating,
                    reviewDescription: resData[key].reviewDescription
                });
                weightedStarReviews = weightedStarReviews + resData[key].rating;
            }
            if (loadedReviews) {
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            // set time for show loading :))
            setTimeout(() => {
                setReviews(loadedReviews);
                setIsLoadingReview(false);
            }, 1000);
        };
        fetchBookReviews()
            .catch((error: any) => {
                setIsLoadingReview(false);
                setHttpError(error.message);
            })
    }, [isReviewLeft]);

    useEffect(() => {
        const fetchUserReviewBook = async () => {
            if (authState !== null && authState.isAuthenticated === true) {
                const url = `${import.meta.env.VITE_API_REVIEW_URL}/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userReview = await fetch(url, requestOptions);
                if (!userReview.ok) {
                    throw new Error("Some thing went wrong at user review book");
                }
                const userReviewResJson = await userReview.json();
                console.log(userReviewResJson);
                setIsReviewLeft(userReviewResJson);
            }
            setIsLoadingUserReview(false);
        }
        fetchUserReviewBook().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `${import.meta.env.VITE_API_BOOKS_URL}/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
                const currentloansCountRes = await fetch(url, requestOptions);
                if (!currentloansCountRes.ok) {
                    throw new Error('Something went wrong');
                }
                const currentLoansCountResJson = await currentloansCountRes.json();
                setCurrentLoansCount(currentLoansCountResJson);
            }
            setIsLoadingCurrentLoansCount(false);
        }
        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, isCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState !== null && authState.isAuthenticated) {
                const url = `${import.meta.env.VITE_API_BOOKS_URL}/secure/ischeckout/byuser?bookId=${bookId}`;
                const reqOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, reqOptions);
                if (!bookCheckedOut.ok) {
                    throw new Error("Some thing went wrong");
                }
                const bookCheckedOutResJson = await bookCheckedOut.json();
                setIsCheckedOut(bookCheckedOutResJson);
            }
            setIsLoadingBookCheckedOut(false);
        }
        fetchUserCheckedOutBook().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || isLoadingReview || isLoadingCurrentLoansCount || isLoadingBookCheckedOut || isLoadingUserReview) {
        return (<SpinnerLoading />);
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    async function checkoutBook() {
        const url = `${import.meta.env.VITE_API_BOOKS_URL}/secure/checkout?bookId=${book?.id}`;
        const reqOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const checkoutRes = await fetch(url, reqOptions);
        if (!checkoutRes.ok) {
            setDisplayError(true);
            throw new Error("Some thing went wrong at checkout book");
        }
        setDisplayError(false);
        setIsCheckedOut(true);
    }

    async function submitReview(starInput: number, reviewDescription: string) {
        let bookId: number = 0;
        if (book?.id !== undefined) {
            bookId = book.id;
        }

        const reviewRequest = new ReviewRequest(starInput, bookId, reviewDescription);
        const url = `${import.meta.env.VITE_API_REVIEW_URL}/secure`;
        const requestOptions = {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(reviewRequest)
        }

        const returnRes = await fetch(url, requestOptions);
        if (!returnRes.ok) {
            throw new Error("Some thing went wrong with submit review !");
        }
        setIsReviewLeft(true);
    }

    return (
        <div>
            {/* Desktop */}
            <div className='container d-none d-lg-block'>
                {displayError === true && <div className="alert alert-danger mt-3" role="alert">
                    Please pay outstanding fees and/or return late book(s)
                </div>
                }
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} alt="book" width='226' height='349' /> :
                            <img src={'src/Images/BooksImages/book-luv2code-1000.png'}
                                alt="book" width='226' height='349' />}
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false} currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                        isReviewLeft={isReviewLeft}
                        submitReview={submitReview}
                    />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-5'>
                {displayError === true && <div className="alert alert-danger mt-3" role="alert">
                    Please pay outstanding fees and/or return late book(s)
                </div>
                }
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} alt="book" width='226' height='349' /> :
                        <img src={'src/Images/BooksImages/book-luv2code-1000.png'}
                            alt="book" width='226' height='349' />}
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={true} currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={isCheckedOut} checkoutBook={checkoutBook}
                    isReviewLeft={isReviewLeft}
                    submitReview={submitReview}
                />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true} />
            </div>
        </div>
    );
}