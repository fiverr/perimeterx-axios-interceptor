/**
 * Remove existing captcha box
 */
module.exports.removeCaptcha = function removeCaptcha() {
    ['.perimeterx-async-challenge', '#px-captcha'].forEach((selector) => {
        const element = document.querySelector(selector);
        element && element.parentElement.removeChild(element);
    });
};

/**
 * Default title
 * @type {string}
 */
const TITLE = 'One Small Step';

/**
 * Default subtitle
 * @type {string}
 */
const SUBTITLE = 'Please check the box below to continue your normal visit';

/**
 * Default quick fixes list
 * @type {string[]}
 */
const QUICKFIXES = [
    '• Please exclude this website from ad blocking or ad filtering software.',
    '• Make sure you don\'t have any browser extensions tampering with request headers or user agent string.',
    '• Make sure JavaScript is enabled in your browser.'
];

/**
 * Default contact support text
 * @type {string}
 */
const CONTACT_SUPPORT = 'If you\'re still having trouble accessing the site, please contact customer support.';

/**
 * Default modal className
 * @type {string}
 */
const CLASSNAME = 'perimeterx-async-challenge';

/**
 * Style tag content
 * @type {string}
 */
const CSS = `
.${CLASSNAME} {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 0;
    margin: 0;
    padding: 0;
    background: rgba(0, 0, 0, .3);
}
.${CLASSNAME} > div {
    margin: 20vh  20vw 0;
    background: white;
    color: black;
    white-space: pre-wrap;
    box-shadow: 0 0 2em rgba(0, 0, 0, .4);
    padding: 1em;
}
.${CLASSNAME} p, .${CLASSNAME} .challenge-box {
    margin: 0 0 .5em;
}
.${CLASSNAME} .title {
    font-size: 1.4em;
}
.${CLASSNAME} .suntitle {
    font-size: 1.2em;
}
.${CLASSNAME} .quickfix {
    font-size: .8em;
}
@media screen and (max-width:1040px) {
    .${CLASSNAME} > div {
        margin: 10vh 10vw 0;
    }
}
@media screen and (max-width:800px) {
    .${CLASSNAME} > div {
        margin: 5vw 5vw 0;
    }
}
`;

/**
 * This dialog contains the entire exoneration user experience
 * @param {string}   [o.className]
 * @param {string}   [o.title]
 * @param {string}   [o.subtitle]
 * @param {string[]} [o.quickfixes]
 * @param {string}   [o.contactSupport]
 * @returns {HTMLDialogElement}
 */
module.exports.createModal = function createModal({
    className = CLASSNAME,
    title = TITLE,
    subtitle = SUBTITLE,
    quickfixes = QUICKFIXES,
    contactSupport = CONTACT_SUPPORT
} = {}) {
    const dialog = document.createElement('dialog');
    dialog.className = className;
    dialog.open = true;
    dialog.addEventListener(
        'click',
        ({ target }) => target === dialog && window._pxOnCaptchaSuccess(false),
        { capture: false }
    );

    const wrap = document.createElement('div');

    title && wrap.appendChild(p(title, 'title'));
    subtitle && wrap.appendChild(p(subtitle, 'subtitle'));

    const challenge = document.createElement('div');
    challenge.id = 'px-captcha';
    challenge.className = 'challenge-box';
    wrap.appendChild(challenge);

    quickfixes && quickfixes.forEach((quickfix) => wrap.appendChild(p(quickfix, 'quickfix')));
    contactSupport && wrap.appendChild(p(contactSupport));

    const style = document.createElement('style');
    style.textContent = CSS;
    wrap.appendChild(style);
    dialog.appendChild(wrap);

    return dialog;
};

/**
 * Create a paragraph with text
 * @param {string} text
 * @param {string} [className]
 * @returns {HTMLParagraphElement}
 */
function p(text, className = '') {
    const p = document.createElement('p');
    p.className = className;
    p.appendChild(document.createTextNode(text));
    return p;
}
