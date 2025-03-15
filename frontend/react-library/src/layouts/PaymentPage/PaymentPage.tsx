import { useOktaAuth } from "@okta/okta-react";
import { useEffect, useState } from "react";
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { Link } from "react-router-dom";

export const PaymentPage = () => {

    const { authState } = useOktaAuth();
    const [httpError, setHttpError] = useState(false);
    const [submitDisabled, setSubmitDisabled] = useState(false);
    const [fees, setFees] = useState(0);
    const [loadingFees, setLoadingFees] = useState(true);
    // need to call checkout has expired days
    // then redirect to vnpay url
    useEffect(() => {
        const fetchFees = async () => {
            if (authState !== null && authState.isAuthenticated) {
                const url = `${import.meta.env.VITE_API_PAYMENT_URL}/secure/vnpay/create-url`;
                const reqOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const userFeesRes = await fetch(url, reqOptions);
                if (!userFeesRes.ok) {
                    throw new Error("Some thing went wrong at user review book");
                }
                const userFeesResJson = await userFeesRes.json();
                setFees(userFeesResJson); // ?
                setLoadingFees(false);
                console.log(userFeesResJson);
            }
        };
        fetchFees().catch((error: any) => {
            setLoadingFees(false);
            setHttpError(error.message)
        });
    }, [authState]);

    if (loadingFees === true) {
        return <SpinnerLoading />
    }

    if (httpError === true) {
        return <div className="container m-5"><p>{httpError}</p></div>
    }

    return <div className="container">
        {fees > 0 &&
            <div className="card mt-3">
                <h5 className="card-header">Fees pending: <span className="text-danger">{fees}</span></h5>
                <div className="card-body">
                    <h5 className="card-title mb-3">Credit Card</h5>
                    <button className="btn btn-md main-color text-white mt-3" disabled={submitDisabled} type="button">Pay fees</button>
                </div>
            </div>}
        {fees === 0 &&
            <div className="mt-3">
                <h5>You have no fees !</h5>
                <Link to={"/search"} type="button" className="btn main-color text-white">Expore top books</Link>
            </div>
        }
        {submitDisabled === true && <SpinnerLoading />}
    </div>;
}