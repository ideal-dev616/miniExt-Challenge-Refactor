import React, { useEffect, useRef, useState } from 'react';

type useStateType = {
    <S>(initialState: S | (() => S)): [
        S,
        React.Dispatch<React.SetStateAction<S>>,
        React.MutableRefObject<S>
    ];
    <S = undefined>(): [
        S | undefined,
        React.Dispatch<React.SetStateAction<S | undefined>>,
        React.MutableRefObject<S | undefined>
    ];
};

/**
 * Adds a ref attribute to useState that provides access to the latest state.
 * Use when accessing state in callbacks to prevent accessing stale state.
 */
export const useStateWithRef: useStateType = <T>(initialValue?: T) => {
    const [state, setState] = useState(initialValue);
    const ref = useRef(state);
    useEffect(() => {
        ref.current = state;
    }, [state]);
    return [state, setState, ref];
};

export default useStateWithRef;
