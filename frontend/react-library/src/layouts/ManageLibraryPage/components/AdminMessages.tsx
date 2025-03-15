import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import Message from "../../../models/Message.model";
import { SpinnerLoading } from "../../Utils/SpinnerLoading";
import { Pagination } from "../../Utils/Pagination";
import { AdminMessage } from "./AdminMessage";
import AdminMessageReq from "../../../models/AdminMessageReq.model";

export const AdminMessages = () => {

    const { authState } = useOktaAuth();

    //normal loading pieces
    const [isLoadingMessages, setIsLoadingMessages] = useState(true);
    const [httpError, setHttpError] = useState(null);

    //Messages endpoint state
    const [messages, setMessages] = useState<Message[]>([]);
    const [messagesPerPage] = useState(5);

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    // recall useEffect
    const [btnSubmit, setBtnSubmit] = useState(false);

    useEffect(() => {
        const fetchUserMessages = async () => {
            if (authState !== null && authState?.isAuthenticated === true) {
                const url: string = `${import.meta.env.VITE_API_MESSAGES_URL}/search/findByClosed?closed=false&page=${currentPage - 1}&size=${messagesPerPage}`;
                const reqOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                // call api
                const userMessagesRes = await fetch(url, reqOptions);
                if (!userMessagesRes.ok) {
                    throw new Error("Some thing went wrong with user messages!");
                }
                const userMessagesResJson = await userMessagesRes.json();
                setMessages(userMessagesResJson._embedded.messages);
                setTotalPages(userMessagesResJson.page.totalPages);
            }
            setIsLoadingMessages(false);
        }
        fetchUserMessages().catch((error: any) => {
            setIsLoadingMessages(false);
            setHttpError(error.message);
        })
        window.scrollTo(0, 0);
    }, [authState, currentPage, btnSubmit]);

    if (isLoadingMessages === true) {
        return <SpinnerLoading />
    }

    if (httpError !== null) {
        <div className="container m-5"><p>{httpError}</p></div>
    }

    async function submitResToQuestion(id: number, response: string) {
        const url = `${import.meta.env.VITE_API_MESSAGES_URL}/secure/admin/message`;
        if (authState !== null && authState?.isAuthenticated === true && id !== null && response !== '') {
            const messageAdminReq: AdminMessageReq = new AdminMessageReq(id, response);
            const reqOptions = {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(messageAdminReq)
            }
            const messageAdminReqRes = await fetch(url, reqOptions);
            if (!messageAdminReqRes.ok) {
                throw new Error("Some thing went wrong at admin submit message");
            }
            setBtnSubmit(!btnSubmit);
        }
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return <div className='mt-3'>
        {messages.length > 0 ?
            <>
                <h5>Pending Q/A: </h5>
                {messages.map((message: Message) => (
                    <AdminMessage message={message} key={message.id} submitResToQuestion={submitResToQuestion} />
                ))}
            </>
            :
            <h5>No pending Q/A</h5>
        }
        {totalPages > 1 && <Pagination currPage={currentPage} totalPages={totalPages} paginate={paginate} />}
    </div>;
}