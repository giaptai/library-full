import React from "react";
import Review from "../../models/Review.model";
import { StarsReview } from "./StarsReview";

export const ReviewItem: React.FC<{ review: Review, key: number }> = (props) => {

    const date: Date = new Date(props.review.date);
    const longMonth: string = date.toLocaleString('en-us', { month: 'long' });
    const dateDay: number = date.getDate();
    const dateYear: number = date.getFullYear();

    const dateRender = longMonth + ' ' + dateDay + ', ' + dateYear;

    return (<div>
        <div className='col-sm-8 col-md-8'>
            <h5>{props.review.userEmail}</h5>
            <div className='row'>
                <div className='col'>{dateRender}</div>
                <div className='col'>
                    <StarsReview rating={props.review.rating} size={16} />
                </div>
            </div>
            <div className='mt-2'>
                <p>{props.review.reviewDescription === "" ? <i>No review description</i> : props.review.reviewDescription}</p>
            </div>
        </div>
        <hr />
    </div>);
}