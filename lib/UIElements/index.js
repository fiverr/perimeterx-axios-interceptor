const {
    TITLE,
    SUBTITLE,
    QUICKFIXES,
    SUFFIX
} = require('./presets');

const {
    CHALLENGE_BOX_CLASSNAME,
    CSS,
    MODAL_CLASSNAME,
    QUICKFIX_CLASSNAME,
    SUBTITLE_CLASSNAME,
    TITLE_CLASSNAME
} = require('./styles');

const PERIMETERX_CHALLENGE_ID = 'px-captcha';

/**
 * Remove existing captcha box
 */
module.exports.removeCaptcha = function removeCaptcha() {
    [`.${MODAL_CLASSNAME}`, `#${PERIMETERX_CHALLENGE_ID}`].forEach((selector) => {
        const element = document.querySelector(selector);
        element && element.parentElement.removeChild(element);
    });
};

/**
 * This dialog contains the entire exoneration user experience
 * @param {string}   [o.className]
 * @param {string}   [o.title]
 * @param {string}   [o.subtitle]
 * @param {string[]} [o.quickfixes]
 * @param {string}   [o.suffix]
 * @returns {HTMLDialogElement}
 */
module.exports.createModal = function createModal({
    className = '',
    title = TITLE,
    subtitle = SUBTITLE,
    quickfixes = QUICKFIXES,
    suffix = SUFFIX
} = {}) {

    // The dialog element is used as an overlay on the page
    const dialog = document.createElement('dialog');
    dialog.className = [MODAL_CLASSNAME, className].filter(Boolean).join(' ');
    dialog.setAttribute('open', 'open');
    dialog.addEventListener(
        'click',
        ({ target }) => {
            if (target !== dialog) {
                return;
            }
            if (target.classList.contains('working')) {
                return;
            }

            window._pxOnCaptchaSuccess(false);
        },
        { capture: false }
    );

    // Inner UI box
    const wrap = document.createElement('div');

    title && addParagraph(wrap, title, TITLE_CLASSNAME);
    subtitle && addParagraph(wrap, subtitle, SUBTITLE_CLASSNAME);

    // Placeholder for PerimeterX challenge
    // Will be filled by PerimeterX loaded Javascript code
    const challenge = document.createElement('div');
    challenge.id = PERIMETERX_CHALLENGE_ID;
    challenge.className = CHALLENGE_BOX_CLASSNAME;
    wrap.appendChild(challenge);

    // Quickfixes paragraphs
    quickfixes && quickfixes.forEach(
        (quickfix) => addParagraph(wrap, quickfix, QUICKFIX_CLASSNAME)
    );

    // Contact support text
    suffix && addParagraph(wrap, suffix);

    // Style element (CSS)
    const style = document.createElement('style');
    style.textContent = CSS;
    wrap.appendChild(style);

    dialog.appendChild(wrap);

    return dialog;
};

/**
 * @return {void}
 */
module.exports.disableModalClose = function disableModalClose() {
    const modal = document.querySelector(`.${MODAL_CLASSNAME}`);
    modal && modal.classList.add('working');
};

/**
 * Create and append a paragraph with text to a parent
 * @param {HTMLElement} parent
 * @param {string}      text
 * @param {string}      [className]
 * @returns {void}
 */
function addParagraph(parent, text, className = '') {
    const p = document.createElement('p');
    className && (p.className = className);
    p.appendChild(document.createTextNode(text));

    parent.appendChild(p);
}
