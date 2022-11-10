/**
 * @type {string[]} List of keys we'd need to be able to prompt PX challenge
 */
const REQUIRED_INFORMATION = ['appId', 'jsClientSrc', 'blockScript'];

/**
 * Check whether the response is a PX response block response, equiped with information to display exoneration modal
 * @param {object} [data] Pasred response body
 * @returns {boolean}
 */
module.exports = function isPXResponse(data) {
    if (!data) {
        return false;
    }
    const props = Object.getOwnPropertyNames(data);

    return REQUIRED_INFORMATION.every(
        (key) => props.includes(key)
    );
};
