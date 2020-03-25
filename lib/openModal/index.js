/**
 * Open a modal for user
 * @param {string} appId [PXXXXXXXXX]
 * @param {string} jsClientSrc Absolute path to the sensor Javascript file [https://client.perimeterx.net/PXXXXXXXXX/main.min.js]
 * @param {string} firstPartyEnabled [false]
 * @param {string} vid Persistent user identifier [2b99ec08-3a22-49f0-a289-a4a6c330b059]
 * @param {string} uuid Request identifier [610a4a35-c45f-4cae-bc58-5abac3a4cdcd]
 * @param {string} hostUrl Your website address [https://www.website.net]
 * @param {string} blockScript Absolute path to the block Javascript file [https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js]
 * @returns {void}
 */
module.exports = async function openModal({

    // appId,
    // jsClientSrc,
    // firstPartyEnabled,
    // vid,
    // uuid,
    // hostUrl,
    blockScript
} = {}) {
    if (typeof blockScript !== 'string') {
        throw new TypeError(`PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received ${blockScript}.`);
    }

    const success = window.confirm('Solve challenge');
    if (success) {
        return;
    }
    throw new Error('PerimeterX Axios Interceptor: Failed to exonerate visitor.');
};
