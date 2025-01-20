import { useEffect, useState } from "react";
import Book from "../../models/Book";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import Review from "../../models/Review";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {

    const [book, setBook] = useState<Book>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //review state
    const [reviews, setReviews] = useState<Review[]>([]);
    const [totalStars, setTotalStars] = useState<number>(0);
    const [isLoadingReview, setIsLoadingReview] = useState<boolean>(true);


    //this variable is going to be used to grab the path parameter out of the URL
    const bookId: number = Number((window.location.pathname).split('/')[2]);

    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = import.meta.env.VITE_API_BASE_URL;
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
    }, []);


    useEffect(() => {
        const fetchBookReviews = async () => {
            const baseUrl: string = import.meta.env.VITE_REVIEW_API_BASE_URL;
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
    }, []);

    if (isLoading || isLoadingReview) {
        return (<SpinnerLoading />);
    }

    if (httpError) {
        <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    return (
        <div>
            {/* Desktop */}
            <div className='container d-none d-lg-block'>
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
                    <CheckoutAndReviewBox book={book} mobile={false} />
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false}/>
            </div>

            {/* Mobile */}
            <div className='container d-lg-none mt-5'>
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
                <CheckoutAndReviewBox book={book} mobile={true} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={true}/>
            </div>
        </div>
    );
}