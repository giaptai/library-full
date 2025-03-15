import { useEffect, useState } from "react";
import Book from "../../../models/Book.model"
import defaultImg from "../../../Images/BooksImages/no-image.png"
import { useOktaAuth } from "@okta/okta-react";

export const ChangeQuantityOfBook: React.FC<{
    book: Book,
    deleteBook: () => void
}> = (props, key) => {
    const { authState } = useOktaAuth();
    const [quantity, setQuantity] = useState<number>(0);
    const [remaining, setRemaining] = useState<number>(0);


    useEffect(() => {
        const fetchBookInState = () => {
            props.book.copies ? setQuantity(props.book.copies) : setQuantity(0);
            props.book.copiesAvailable ? setRemaining(props.book.copiesAvailable) : setRemaining(0);
        }
        fetchBookInState();
    }, []);

    async function increaseQuantity() {
        const url = `${import.meta.env.VITE_API_ADMIN_URL}/secure/increase/book/quantity?bookId=${props.book.id}`;
        const reqOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateRes = await fetch(url, reqOptions);
        if (!quantityUpdateRes.ok) {
            throw new Error("Some thing went wrong at increase book quantity");
        }
        setQuantity(quantity + 1);
        setRemaining(remaining + 1);
    }

    async function decreaseQuantity() {
        const url = `${import.meta.env.VITE_API_ADMIN_URL}/secure/decrease/book/quantity?bookId=${props.book.id}`;
        const reqOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const quantityUpdateRes = await fetch(url, reqOptions);
        if (!quantityUpdateRes.ok) {
            throw new Error("Some thing went wrong at increase book quantity");
        }
        setQuantity(quantity - 1);
        setRemaining(remaining - 1);
    }

    async function deleteBook() {
        const url = `${import.meta.env.VITE_API_ADMIN_URL}/secure/delete/book?bookId=${props.book.id}`;
        const reqOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };

        const UpdateRes = await fetch(url, reqOptions);
        if (!UpdateRes.ok) {
            throw new Error("Some thing went wrong at increase book quantity");
        }
        props.deleteBook();
    }

    return <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
        <div className='row g-0'>
            <div className='col-md-2'>
                {/* desktop img */}
                <div className='d-none d-lg-block'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' /> :
                        <img src={defaultImg} width='123' height='196' alt='Book' />
                    }
                </div>
                {/* mobile img */}
                <div className='d-lg-none d-flex justify-content-center align-items-center'>
                    {props.book.img ?
                        <img src={props.book.img} width='123' height='196' alt='Book' /> :
                        <img src={defaultImg} width='123' height='196' alt='Book' />
                    }
                </div>
            </div>
            <div className='col-md-6'>
                <div className='card-body'>
                    <h5 className='card-title'>{props.book.author}</h5>
                    <h4>{props.book.title}</h4>
                    <p className='card-text'> {props.book.description} </p>
                </div>
            </div>
            <div className='mt-3 col-md-4'>
                <div className='d-flex justify-content-center align-items-center'>
                    <p>Total Quantity: <b>{quantity}</b></p>
                </div>
                <div className='d-flex justify-content-center align-items-center'>
                    <p>Books Remaining: <b>{remaining}</b></p>
                </div>
            </div>
            <div className='mt-3 col-md-1'>
                <div className='d-flex justify-content-start'>
                    <button className='m-1 btn btn-md btn-danger' onClick={deleteBook}>Delete</button>
                </div>
            </div>
            <button className='m1 btn btn-md main-color text-white' onClick={increaseQuantity}>Add Quantity</button>
            <button className='m1 btn btn-md btn-warning' onClick={decreaseQuantity}>Decrease Quantity</button>
        </div>
    </div>;
}