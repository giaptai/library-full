import { useOktaAuth } from "@okta/okta-react"
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import History from "../../../models/History.model";
import DefaultImge from "./../../../Images/BooksImages/book-luv2code-1000.png";
import { Link } from "react-router-dom";
import { Pagination } from "../../Utils/Pagination";

export const HistoryPage = () => {
    const { authState } = useOktaAuth();
    const [isLoadingHistory, setIsloadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Histories
    const [histories, setHistories] = useState<History[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        const fetchHistory = async () => {
            if (authState !== null && authState.isAuthenticated === true) {
                const url = `${import.meta.env.VITE_API_HISTORY_URL}/search/findBooksByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=5`;
                const requestOptions = {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                };
                const historyRes = await fetch(url, requestOptions);
                if (!historyRes.ok) {
                    throw new Error("Something went wrong at history !");
                }
                const historyResJson = await historyRes.json();
                setHistories(historyResJson._embedded.histories);
                setTotalPages(historyResJson.page.totalPages);
            }
            setIsloadingHistory(false);
        }
        fetchHistory().catch((error: any) => {
            setIsloadingHistory(false);
            setHttpError(error.message);
        });

    }, [authState, currentPage]);

    if (isLoadingHistory === true) {
        return <SpinnerLoading />
    }

    if (httpError !== null) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return <div className="mt-2">
        {histories.length > 0 ?
            <>
                <h5>Recent History:</h5>
                {histories.map(history => (
                    <div key={history.id}>
                        <div className="card my-3 shadow p-3 bg-body rounded">
                            <div className="row g-0">
                                <div className="col-md-2">
                                    <div className="d-none d-lg-block">
                                        {history.img ?
                                            <img src={history.img} width={123} height={196} alt="Book" />
                                            :
                                            <img src={DefaultImge} width={123} height={196} alt="BookDefault" />
                                        }
                                    </div>
                                    <div className="d-lg-none d-flex justify-content-center align-items-center">
                                        {history.img ?
                                            <img src={history.img} width={123} height={196} alt="Book" />
                                            :
                                            <img src={DefaultImge} width={123} height={196} alt="BookDefault" />
                                        }
                                    </div>
                                </div>
                                <div className="col">
                                    <div className="card-body">
                                        <h5 className="card-title">{history.author}</h5>
                                        <h4>{history.title}</h4>
                                        <p className="card-text">{history.description}</p>
                                        <hr />
                                        <p className="card-text">Check out on: {history.checkoutDate}</p>
                                        <p className="card-text">Returned on: {history.returnedDate}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                ))}
            </>
            :
            <>
                <h3 className="mt-3"> Currently no history:</h3>
                <Link className="btn btn-primary" to={'search'}>Search for new book</Link>
            </>
        }
        {totalPages > 1 && <Pagination currPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>;
}