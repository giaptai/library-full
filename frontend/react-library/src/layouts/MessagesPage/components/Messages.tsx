import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message.model";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";

export const Messages = () => {
    const { authState } = useOktaAuth();
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Messages
    const [messages, setMessages] = useState<Message[]>([]);

    //Pagination
    const [messagesPerPage] = useState(5);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState !== null && authState.isAuthenticated === true) {
                const url = `${import.meta.env.VITE_API_MESSAGES_URL}/search/findByUserEmail?userEmail=${authState.accessToken?.claims.sub}&page=${currentPage - 1}&size=${messagesPerPage}`;
                const reqOptions = {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`
                    }
                }

                const userMessagesRes = await fetch(url, reqOptions);
                if (!userMessagesRes.ok) {
                    throw new Error("Some thing went wrong at fetch user messages!");
                }
                const userMessageJson = await userMessagesRes.json();
                setMessages(userMessageJson._embedded.messages);
                setTotalPages(userMessageJson.page.totalPages);
            }
            setIsLoadingMessages(false)
        }

        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error)
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage]);

    if (isLoadingMessages === true) {
        return <SpinnerLoading />
    }
    if (httpError !== null) {
        return <div className="container m-5">
            <p>{httpError}</p>
        </div>
    }
    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    return <div className='mt-2'>
        {messages.length > 0 ?
            <>
                <h5>Current Q/A: </h5>
                {messages.map(message => (
                    <div key={message.id}>
                        <div className='card my-2 shadow p-3 bg-body rounded'>
                            <h5>Case #{message.id}: {message.title}</h5>
                            <h6>{message.userEmail}</h6>
                            <p>{message.question}</p>
                            <hr />
                            <div>
                                <h5>Response: </h5>
                                {message.response && message.adminEmail ?
                                    <>
                                        <h6>{message.adminEmail} (admin)</h6>
                                        <p>{message.response}</p>
                                    </>
                                    :
                                    <p><i>Pending response from administration. Please be patient.</i></p>
                                }
                            </div>
                        </div>
                    </div>
                ))}
            </>
            :
            <h5>All questions you submit will be shown here</h5>
        }
        {totalPages > 1 && <Pagination currPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>;
}