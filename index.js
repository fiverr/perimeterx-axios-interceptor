const fulfilled = require('./lib/fulfilled');
const rejected = require('./lib/rejected');

/**
 * attached - a collection of axios instances which were attached the PerimeterX interceptor
 * @type {Map}
 */
const attached = new Map();

/**
 * Attach PerimeterX interceptor to an axios instance
 * @param {Axios}    axios instance
 * @param {Function} [o.filter] Called before the process starts, when returns false it cancels the popup
 * @param {Function} [o.onsuccess] Called when challenge was solved successfully
 * @param {Function} [o.onfailure] Called when challenge was submitted but failed
 * @param {Function} [o.onerror]   Called with any error thrown by the flow
 * @param {string}   [o.c.className]  Add custom className to modal
 * @param {string}   [o.c.title]      Replace or disable default title
 * @param {string}   [o.c.subtitle]   Replace or disable default subtitle
 * @param {string[]} [o.c.quickfixes] Replace or disable default quick fixes (list)
 * @param {string}   [o.c.suffix]     Replace or disable default suffix
 * @returns self
 *
 * @example
 * attach(axios, {
 *     filter: () => !isbot(navigator.userAgent),
 *     onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
 *     onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
 *     onerror: error => logger.error(error),
 *     modalConfig: {
 *         className: 'my-challenge-popup',
 *         title: 'Are you human?',
 *         subtitle: 'Please complete the challenge',
 *         quickfixes: [
 *             '1. Disable adblocker',
 *             '2. Enable Javascript'
 *         ],
 *         suffix: 'Still having issues? Contact support at support@example.com'
 *     }
 * });
 */
module.exports.attach = function attach(axios, {
    filter = () => true,
    onsuccess = () => null,
    onfailure = () => null,
    onerror = () => null,
    modalConfig = {}
} = {}) {
    const context = { axios, filter, onsuccess, onfailure, onerror, modalConfig };

    if (!attached.has(axios)) {
        attached.set(
            axios,
            axios.interceptors.response.use(
                fulfilled.bind(context),
                rejected.bind(context)
            )
        );
    }

    return module.exports;
};

/**
 * Detach PerimeterX interceptor from an axios instance
 * @param axios Axios instance
 * @returns self
 */
module.exports.detach = function detach(axios) {
    if (attached.has(axios)) {
        axios.interceptors.response.eject(attached.get(axios));
        attached.delete(axios);
    }

    return module.exports;
};
