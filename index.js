const fulfilled = require('./lib/fulfilled');
const rejected = require('./lib/rejected');

const attached = new Map();

/**
 * @param {Axios}    axios instance
 * @param {Function} [o.before] Called before the process starts, if it returns false it cancels the popup
 * @param {Function} [o.onsuccess] Called when challenge was solved successfully
 * @param {Function} [o.onfailure] Called when challenge was submitted but failed
 * @param {Function} [o.onerror]   Called with any error thrown by the flow
 * @param {Boolean}  [o.disableCss=false] Whether to cancel the dialog CSS
 * @returns self
 *
 * @example
 * attach(axios, {
 *     before: () => isbot(navigator.userAgent),
 *     onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
 *     onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
 *     onerror: error => logger.error(error),
 *     disableCss: false, // default
 * });
 */
module.exports.attach = function attach(axios, {
    before = () => true,
    onsuccess = () => null,
    onfailure = () => null,
    onerror = () => null,
    disableCss = false
} = {}) {
    const context = { axios, before, onsuccess, onfailure, onerror, disableCss };

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
