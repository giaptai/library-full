import { MutableRefObject, useEffect, useRef, useState } from "react";

export const MyUseref = () => {
    const countRef: MutableRefObject<number> = useRef(0);
    const ref = useRef(null);

    // const obj = { current: 0 };
    const [count, setCount] = useState(0);
    const handleClick = () => {
        // setCount(count + 1);
        countRef.current = countRef.current + 1;
        console.log(countRef);
        // obj.current = obj.current + 1;
    }
    /**
     * the different between useRef and object is that
     * after re-render useRef return the previous object with new value
     * and the pure object - obj will be created after 
     */
    /**
     * Compare useRef and useSate
     * useRef                               |           useStae
     * - Remain variable value between re-render             
     *                                      | 
     * - change value do not make re-render | - change value makes re-render
     * - can access to DOM elements         |        
     */
    // console.log({ count, 
    //     countRef, 
    //     obj 
    // });

    // useEffect(() => {
    // stale closure problem
    // setInterval(() => {
    //     setCount(count + 1); // the problem
    //     countRef.current = countRef.current + 1; // the sovle
    //     console.log({ count, countref: countRef.current });
    // }, 1000);
    // }, []);
    console.log({ ref });

    useEffect(() => {
        // ref.current.focus();
    }, []);

    return <>
        <input type="text" ref={ref} />
        <button type={'button'} onClick={() => handleClick()}>CLICK BUTTON</button>
    </>
}