const { removeCaptcha, createModal, disableModalClose } = require('../UIElements');

/**
 * Open a modal for user
 * @param {string} appId [PXXXXXXXXX]
 * @param {string} jsClientSrc Absolute path to the sensor Javascript file [https://client.px-cdn.net/PXXXXXXXXX/main.min.js]
 * @param {boolean} firstPartyEnabled [false]
 * @param {string} vid Persistent user identifier [2b99ec08-3a22-49f0-a289-a4a6c330b059]
 * @param {string} uuid Request identifier [610a4a35-c45f-4cae-bc58-5abac3a4cdcd]
 * @param {string} hostUrl Your website address [https://www.website.net]
 * @param {string} blockScript Absolute path to the block Javascript file [https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js]
 * @returns {void}
 */
module.exports = (
    {
        appId,
        jsClientSrc,
        firstPartyEnabled,
        vid,
        uuid,
        hostUrl,
        blockScript
    } = {},
    modalConfig = {}
) => new Promise(((resolve, reject) => {
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

    const _pxOnCaptchaSuccess = window._pxOnCaptchaSuccess;
    window._pxOnCaptchaSuccess = function(isValid) {
        removeCaptcha();
        isValid
            ? resolve()
            : reject(new Error('PerimeterX Axios Interceptor: Failed to exonerate visitor.'))
        ;
        window._pxOnCaptchaSuccess = _pxOnCaptchaSuccess;
        return _pxOnCaptchaSuccess && _pxOnCaptchaSuccess.call(window, isValid);
    };

    const body = document.body || document.getElementsByTagName('body')[0];
    function abort() {
        removeCaptcha();
        reject(new Error('PerimeterX Axios Interceptor: Aborted by user.'));
    }

    removeCaptcha();
    const modal = createModal(
        Object.assign(
            { abort },
            modalConfig
        )
    );
    body.appendChild(modal);

    const script = document.createElement('script');
    script.src = blockScript;
    recaptchaHandling(script, { base: modal, timeout: modalConfig.timeout, reject });

    body.appendChild(script);
}));

/**
 * @param {HTMLScriptElement} script PerimeterX script element
 * @param {HTMLElement} [o.base]     Modal root element
 * @param {number}      [timeout]    Time, in milliseconds, to allow PerimeterX script to load
 * @param {function}    [reject]     Trigger a rejection to the process
 * @returns {void}
 */
function recaptchaHandling(script, { base = document, timeout = 3000, reject = () => null } = {}) {
    const abort = timeout < Infinity
        ? setTimeout(() => {
            removeCaptcha();
            reject(new Error(`PerimeterX Axios Interceptor: Failed to load script resource after ${timeout}ms.`));
        }, timeout)
        : undefined
    ;

    script.addEventListener(
        'load',
        () => {
            clearTimeout(abort);
            setTimeout(
                () => {
                    const recaptcha = base.querySelector('.g-recaptcha');
                    if (!recaptcha) { return; }

                    const callbackName = recaptcha.getAttribute('data-callback');
                    const callback = window[callbackName];
                    if (typeof callback !== 'function') { return; }

                    // Override existing callback
                    window[callbackName] = function recaptchaCallback(...args) {
                        disableModalClose();
                        return callback.apply(window, args);
                    };
                }
            );
        }
    );
}
