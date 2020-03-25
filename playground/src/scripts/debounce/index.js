/**
 * @param {function} fn Function to execute after delay has passed from last call
 * @param {number} [delay=500] Appr milliseconds to delay before execution
 * @returns {function} A "debounced" function
 */
export default function debounce(fn, delay = 500) {
    let timer;
    return function debounced(...args) {
        clearTimeout(timer);
        timer = setTimeout(
            fn.bind(this, ...args),
            delay
        );
    };
}
