/**
 * Open a modal for user
 * @param {string} appId [PXXXXXXXXX]
 * @param {string} jsClientSrc Absolute path to the sensor Javascript file [https://client.perimeterx.net/PXXXXXXXXX/main.min.js]
 * @param {boolean} firstPartyEnabled [false]
 * @param {string} vid Persistent user identifier [2b99ec08-3a22-49f0-a289-a4a6c330b059]
 * @param {string} uuid Request identifier [610a4a35-c45f-4cae-bc58-5abac3a4cdcd]
 * @param {string} hostUrl Your website address [https://www.website.net]
 * @param {string} blockScript Absolute path to the block Javascript file [https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js]
 * @returns {void}
 */
module.exports = ({
    appId,
    jsClientSrc,
    firstPartyEnabled,
    vid,
    uuid,
    hostUrl,
    blockScript
} = {}) => new Promise(((resolve, reject) => {
    if (typeof blockScript !== 'string') {
        reject(new TypeError(`PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received ${blockScript}.`));
        return;
    }

    Object.assign(
        window,
        {
            _pxAppId: appId,
            _pxJsClientSrc: jsClientSrc,
            _pxFirstPartyEnabled: firstPartyEnabled,
            _pxVid: vid,
            _pxUuid: uuid,
            _pxHostUrl: hostUrl
        }
    );

    window._pxOnCaptchaSuccess = function(isValid) {
        if (isValid) {
            removeCaptcha();
            resolve();
        } else {
            reject(new Error('PerimeterX Axios Interceptor: Failed to exonerate visitor.'));
        }
    };

    removeCaptcha();
    const body = document.body || document.getElementsByTagName('body')[0];
    const div = document.createElement('div');
    div.id = 'px-captcha';
    body.appendChild(div);

    const script = document.createElement('script');
    script.src = blockScript;
    body.appendChild(script);
}));

/**
 * Remove existing captcha box
 */
function removeCaptcha() {
    const captcha = document.getElementById('px-captcha');
    captcha && captcha.parentElement.removeChild(captcha);
}
