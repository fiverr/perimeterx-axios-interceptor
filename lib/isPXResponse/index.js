/**
 * @type {string[]} List of keys we'd need to be able to prompt PX challenge
 */
const REQUIRED_INFORMATION = ['appId', 'jsClientSrc', 'blockScript'];

/**
 * @param {object} [data={}] Response object
 * @returns {boolean}
 */
module.exports = function isPXResponse(data = {}) {
    const props = Object.getOwnPropertyNames(data);

    return REQUIRED_INFORMATION.every(
        (key) => props.includes(key)
    );
};
