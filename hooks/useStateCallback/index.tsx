import { useEffect, useRef, useState, useCallback } from 'react';

type SetStateCallback<T> = (state: T) => void

type SetStateFunction<T> = (newState: T | ((prevState: T) => T), callback?: SetStateCallback<T>) => void;

function useStateCallback<T>(initialState: T | (() => T)): [T, SetStateFunction<T>] {
    const [state, setState] = useState(initialState);

    const callbackRef = useRef<SetStateCallback<T> | null>(null);

    const setStateCallback: SetStateFunction<T> = useCallback(
        (newState, callback) => {
            callbackRef.current = callback || null;
            setState(newState);
        },
        [setState]
    );

    useEffect(() => {
        if (callbackRef.current) {
            callbackRef.current(state);
            callbackRef.current = null;
        }
    }, [state]);

    return [state, setStateCallback];
};

export default useStateCallback;
