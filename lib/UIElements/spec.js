const {
    CHALLENGE_BOX_CLASSNAME,
    MODAL_CLASSNAME,
    QUICKFIX_CLASSNAME,
    SUBTITLE_CLASSNAME,
    TITLE_CLASSNAME
} = require('./styles');
const { removeCaptcha, createModal } = require('.');

describe('lib/UIElements', () => {
    afterEach(() => {
        removeCaptcha();
    });
    describe('removeCaptcha', () => {
        it('should find and remove any existing PerimeterX challenges on the page', () => {
            const pxCaptcha = document.createElement('div');
            pxCaptcha.id = 'px-captcha';
            document.body.appendChild(pxCaptcha);

            const modal = document.createElement('dialog');
            modal.className = MODAL_CLASSNAME;
            document.body.appendChild(modal);

            removeCaptcha();
            expect(
                document.body.querySelector('#px-captcha')
            ).toBe(null);
            expect(
                document.body.querySelector(`.${MODAL_CLASSNAME}`)
            ).toBe(null);
        });
    });
    describe('createModal', () => {
        it('should build the modal UI, PerimeterX and default content', () => {
            expect(createModal()).toMatchSnapshot();
        });
        it('should include the challenge box', () => {
            const modal = createModal();
            const challenge = modal.querySelector(`.${CHALLENGE_BOX_CLASSNAME}`);
            expect(challenge.id).toBe('px-captcha');

        });
        it('should accept custom className', () => {
            expect(createModal().className).toBe(MODAL_CLASSNAME);
            expect(createModal({ className: 'customised' }).className).toBe('customised');
        });
        it('should use title override', () => {
            const selector = `p.${TITLE_CLASSNAME}`;
            expect(createModal().querySelector(selector)).not.toBe(null);
            expect(createModal({ title: null }).querySelector(selector)).toBe(null);
            expect(createModal({ title: 'Something Unexpected' }).querySelector(selector).textContent).toBe('Something Unexpected');
        });
        it('should use subtitle override', () => {
            const selector = `p.${SUBTITLE_CLASSNAME}`;
            expect(createModal().querySelector(selector)).not.toBe(null);
            expect(createModal({ subtitle: null }).querySelector(selector)).toBe(null);
            expect(createModal({ subtitle: 'Something Unexpected' }).querySelector(selector).textContent).toBe('Something Unexpected');
        });
        it('should use contactSupport override', () => {
            const selector = 'p[class=""]';
            expect(createModal().querySelector(selector)).not.toBe(null);
            expect(createModal({ contactSupport: null }).querySelector(selector)).toBe(null);
            expect(createModal({ contactSupport: 'Something Unexpected' }).querySelector(selector).textContent).toBe('Something Unexpected');
        });
        it('should use quickfixes override', () => {
            const selector = `p[class="${QUICKFIX_CLASSNAME}"]`;
            expect(createModal().querySelector(selector)).not.toBe(null);
            expect(createModal({ quickfixes: null }).querySelector(selector)).toBe(null);

            const list = createModal({ quickfixes: ['a. 1', 'b. 2'] }).querySelectorAll(selector);
            expect(list.length).toBe(2);
            expect([].map.call(list, ({textContent}) => textContent)).toEqual(['a. 1', 'b. 2']);
        });
    });
});
