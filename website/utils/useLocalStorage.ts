import { useState } from 'react';
import { simpleLogError } from './logError';

function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, (args0: T) => void] {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            if (typeof window === 'undefined') {
                // Don't run on server
                return;
            }

            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            // If error also return initialValue
            console.log(error);
            return initialValue;
        }
    });

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value: T) => {
        try {
            if (typeof window === 'undefined') {
                // Don't run on server
                return;
            }

            // Allow value to be a function so we have same API as useState
            const valueToStore = value;
            // Save state
            setStoredValue(valueToStore);
            // Save to local storage
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            simpleLogError(error);
            // A more advanced implementation would handle the error case

            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
