import React from "react";

export const Pagination: React.FC<
    {
        currPage: number,
        totalPages: number,
        paginate: any
    }> = (props) => {

        const pageNumbers = [];

        if (props.currPage === 1) {
            pageNumbers.push(props.currPage);
            if (props.totalPages >= props.currPage + 1) {
                pageNumbers.push(props.currPage + 1);
            }
            if (props.totalPages >= props.currPage + 2) {
                pageNumbers.push(props.currPage + 2);
            }
        } else if (props.currPage > 1) {
            if (props.currPage >= 3) {
                pageNumbers.push(props.currPage - 2);
                pageNumbers.push(props.currPage - 1);
            } else {
                pageNumbers.push(props.currPage - 1);
            }

            pageNumbers.push(props.currPage);

            if (props.totalPages >= props.currPage + 1) {
                pageNumbers.push(props.currPage + 1);
            }

            if (props.totalPages >= props.currPage + 2) {
                pageNumbers.push(props.currPage + 2);
            }
        }

        return (
            <nav aria-label="Page navigation example">
                <ul className='pagination'>
                    <li className='page-item' onClick={() => props.paginate(1)}>
                        <button className='page-link'>
                            First Page
                        </button>
                    </li>
                    {pageNumbers.map(number => (
                        <li key={number} onClick={() => props.paginate(number)}
                            className={'page-item ' + (props.currPage === number ? 'active' : '')}>
                            <button className='page-link'>
                                {number}
                            </button>
                        </li>
                    ))}
                    <li className='page-item' onClick={() => props.paginate(props.totalPages)}>
                        <button className='page-link'>
                            Last Page
                        </button>
                    </li>
                </ul>
            </nav>
        );
    }