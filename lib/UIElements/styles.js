/**
 * Default modal className
 * @type {string}
 */
const MODAL_CLASSNAME = 'perimeterx-async-challenge';

/**
 * Challenge added className
 * @type {string}
 */
const CHALLENGE_BOX_CLASSNAME = 'challenge-box';

/**
 * Title paragraph className
 * @type {string}
 */
const TITLE_CLASSNAME = 'title';

/**
 * Subtitle paragraph className
 * @type {string}
 */
const SUBTITLE_CLASSNAME = 'subtitle';

/**
 * Quickfixes paragraphs className
 * @type {string}
 */
const QUICKFIX_CLASSNAME = 'quickfix';

/**
 * Style tag content
 * @type {string}
 */
const CSS = `
.${MODAL_CLASSNAME} {
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
.${MODAL_CLASSNAME} > div {
    margin: 20vh 20vw 0;
    background: white;
    color: black;
    white-space: pre-wrap;
    box-shadow: 0 0 2em rgba(0, 0, 0, .4);
    padding: 1em;
}
.${MODAL_CLASSNAME} p,
.${MODAL_CLASSNAME} .${CHALLENGE_BOX_CLASSNAME} {
    margin: 0 0 .5em;
}
.${MODAL_CLASSNAME} .${TITLE_CLASSNAME} {
    font-size: 1.4em;
}
.${MODAL_CLASSNAME} .${SUBTITLE_CLASSNAME} {
    font-size: 1.2em;
}
.${MODAL_CLASSNAME} .${QUICKFIX_CLASSNAME} {
    font-size: .8em;
}
@media screen and (max-width:1040px) {
    .${MODAL_CLASSNAME} > div {
        margin: 10vh 10vw 0;
    }
}
@media screen and (max-width:800px) {
    .${MODAL_CLASSNAME} > div {
        margin: 5vw 5vw 0;
    }
}
`;

module.exports = {
    CHALLENGE_BOX_CLASSNAME,
    CSS,
    MODAL_CLASSNAME,
    QUICKFIX_CLASSNAME,
    SUBTITLE_CLASSNAME,
    TITLE_CLASSNAME
};
