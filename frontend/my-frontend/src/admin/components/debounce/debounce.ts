import { useState, useEffect } from 'react';


const useDebounce = <T>(value: T, delay: number): T => {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set up a timer to update the debounced value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function: This is called if the value changes (and useEffect runs again) 
    // or if the component unmounts. It clears the previous timer to ensure only the 
    // latest value is used after the delay.
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run effect only if value or delay changes

  return debouncedValue;
};

export default useDebounce;