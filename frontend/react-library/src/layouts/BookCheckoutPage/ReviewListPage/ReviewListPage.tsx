import { useEffect, useState } from "react";
import Review from "../../../models/Review.model";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { ReviewItem } from "../../Utils/ReviewItem";

export const ReviewListPage = () => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [reviewsPerPage] = useState(5);
    const [totalAmountOfReviews, setTotalAmountOfReviews] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    //Book to lookup reviews
    const bookId = (window.location.pathname).split('/')[2];

    useEffect(() => {
        const fetchBookReviews = async () => {
            const baseUrl: string = import.meta.env.VITE_API_REVIEW_URL;
            const url: string = `${baseUrl}/search/findByBookId?bookId=${bookId}&page=${currentPage - 1}&size=${reviewsPerPage}&projection=reviewView`;

            const res = await fetch(url);
            if (!res.ok) {
                throw new Error("Something went wrong!");
            }
            const resJson = await res.json();
            const resData = resJson._embedded.reviews;

            setTotalAmountOfReviews(resJson.page.totalElements);
            setTotalPages(resJson.page.totalPages);

            const loadedReviews: Review[] = [];

            for (const key in resData) {
                loadedReviews.push({
                    id: resData[key].id,
                    userEmail: resData[key].userEmail,
                    date: resData[key].date,
                    book_id: resData[key].bookId,
                    rating: resData[key].rating,
                    reviewDescription: resData[key].reviewDescription,
                });
            }
            // set time for show loading :))
            setTimeout(() => {
                setReviews(loadedReviews);
                setIsLoading(false);
            }, 1000);
        };
        fetchBookReviews()
            .catch((error: any) => {
                setIsLoading(false);
                setHttpError(error.message);
            })
    }, [currentPage]);

    if (isLoading === true) {
        return <SpinnerLoading />;
    }

    if (httpError) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const indexLastReview: number = currentPage * reviewsPerPage; // currentPage = 2, reviewsPerPage = 5, indexLastReview = 10
    const indexFirstReview: number = indexLastReview - reviewsPerPage; // indexFirstReview = 10 - 5 = 5

    // if reviewsPerPage = 5 * currentPage = 4 = 20, totalAmountOfReviews = 21
    // 20 < 21 then return reviewsPerPage * currentPage = 20
    let lastItem = reviewsPerPage * currentPage <= totalAmountOfReviews ? reviewsPerPage * currentPage : totalAmountOfReviews;

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return <div className="container m-5">
        <div>
            <h3>Comments: {reviews.length}</h3>
        </div>
        <p>
            {indexFirstReview + 1} to {lastItem} of {totalAmountOfReviews} items:
        </p>
        <div className="row">
            {reviews.map(review => {
                return <ReviewItem review={review} key={review.id} />
            })}
        </div>

        {totalPages > 1 && <Pagination currPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>;
}