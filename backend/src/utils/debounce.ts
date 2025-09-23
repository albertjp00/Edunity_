type TimerMap = Map<string, NodeJS.Timeout>;
const timers: TimerMap = new Map();

/**
 * Debounce function calls based on a key
 * @param key Unique key for debouncing (e.g., userId + action)
 * @param delay Debounce delay in milliseconds
 * @param fn Function to execute after debounce
 */

export function debounceCall<T>(key: string, delay: number, fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
        // If there's an existing timer for this key, clear it
        if (timers.has(key)) {
            clearTimeout(timers.get(key)!);
        }

        // Set a new timer
        timers.set(key, setTimeout(async () => {
            timers.delete(key);
            try {
                const result = await fn();
                resolve(result);
            } catch (err) {
                reject(err);
            }
        }, delay));
    });
}
