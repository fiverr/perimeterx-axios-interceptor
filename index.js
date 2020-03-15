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
 * @param {String}   [o.customClass] Custom class name for the dialog
 * @returns self
 *
 * @example
 * attach(axios, {
 *     before: () => isbot(navigator.userAgent),
 *     onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
 *     onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
 *     onerror: error => logger.error(error),
 *     customClass: '',
 * });
 */
module.exports.attach = function attach(axios, {
    filter = () => true,
    onsuccess = () => null,
    onfailure = () => null,
    onerror = () => null,
    customClass = ''
} = {}) {
    const context = { axios, filter, onsuccess, onfailure, onerror, customClass };

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
