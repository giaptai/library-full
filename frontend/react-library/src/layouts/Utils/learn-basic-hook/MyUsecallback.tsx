import { useCallback, useEffect, useState } from "react";

export const MyUsecallback = () => {
    const [users, setUsers] = useState([]);
    /**
     * useCallback
     * use when you want to memoize functions
     * and don't want to call function again if value is the same
     * memory consumption for remmember   j8the function
     */
    const getData = useCallback((type: any) => {
        return fetch(`https://reqres.in/api/${type}`);
    }, []);

    const handleClick = () => {
        getData('users')
            .then((res: Response) => res.json())
            .then((res: any) => {
                const users = res.data;
                setUsers(users);
            })
    }

    return (<>
        <p>Data: </p>
        <button type="button" onClick={handleClick}>Get Users Data</button>
        <p>{JSON.stringify(users)}</p>
        <ChildComponent getData={getData} />
    </>);
}

const ChildComponent = ({ getData }: any) => {
    const [comments, setComments] = useState([]);

    useEffect(() => {
        getData('comments')
            .then((res: Response) => res.json())
            .then((res: any) => {
                const comments = res.data;
                setComments(comments);
            })
    }, [getData]);


    return (
        <div>
            <p>ChildComponent</p>
            <p>{JSON.stringify(comments)}</p>
        </div>
    );
}