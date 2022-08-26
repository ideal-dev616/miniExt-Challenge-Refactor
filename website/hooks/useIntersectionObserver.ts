import { useCallback, useEffect, useState } from 'react';

/**
 * The options passed the the IntersectionObserver constructor
 * https://developer.mozilla.org/en-US/docs/Web/API/IntersectionObserver/IntersectionObserver
 */
type initOptions = {
    rootMargin?: IntersectionObserverInit['rootMargin'];
};

const useIntersectionObserver = (init: initOptions) => {
    const [elements, setElements] = useState<{
        root?: Element;
        ref?: Element;
    }>({});
    const [inView, setInView] = useState(false);

    const root = useCallback((node) => {
        if (node != null) {
            setElements((elements) => ({
                ...elements,
                root: node,
            }));
        }
    }, []);

    const ref = useCallback((node) => {
        if (node != null) {
            setElements((elements) => ({
                ...elements,
                ref: node,
            }));
        }
    }, []);

    useEffect(() => {
        const { root, ref } = elements;
        if (root && ref) {
            const io = new IntersectionObserver(
                (entries) => {
                    if (entries[0].isIntersecting) {
                        setInView(true);
                    } else {
                        setInView(false);
                    }
                },
                {
                    root,
                    rootMargin: init.rootMargin,
                }
            );
            io.observe(ref);
        }
    }, [elements, init.rootMargin]);

    return { root, ref, inView };
};

export default useIntersectionObserver;
