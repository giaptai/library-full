import { useState, useMemo } from "react";

function expensiveFunc(number: number) {
    console.log('Begin');
    const start = new Date().getMilliseconds();

    while ((new Date().getMilliseconds() - start) < 3000);

    console.log('Finished', (new Date().getMilliseconds() - start), 'ms');

    return number * number;
}

/**
 * useMemo
 * use when you want to memoize values
 * and don't want to call function again if value is the same
 * memory consumption for remmember previous variable
 */

const MyUseMemo: React.FC<{}> = () => {
    const [count, setCount] = useState(0);
    const [num, setNum] = useState(20);
    const number = useMemo(() => {
        return expensiveFunc(num)
    }, [num]); // no second argument so when re-render this function will always be called
    // if you second argument is empty array, it will be called once.
    return (
        <>
            <button onClick={() => setCount(count + 1)} type="button">Add</button>
            <p>Count: {count}</p>
            <p>Number: {number}</p>
        </>
    );
}

export default MyUseMemo;