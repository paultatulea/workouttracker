import { useRef, useEffect } from 'react';

export default function useClickOutside(handler) {
    const ref = useRef();
    useEffect(() => {
        let maybeHandler = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", maybeHandler);
        return () => {
            document.removeEventListener("mousedown", maybeHandler);
        }
    }, [ref])

    return ref
}