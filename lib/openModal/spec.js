const wait = require('@lets/wait');
const { removeCaptcha } = require('../UIElements');
const openModal = require('.');

const data = {
    blockScript: 'https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js'
};
const { setTimeout } = window;

describe('lib/openModal', () => {
    beforeAll(() => {
        // Speed things up
        window.setTimeout = (fn, ms = 1000) => setTimeout(fn, ms / 1000);
    });
    afterEach(() => {
        removeCaptcha();
        [].forEach.call(
            document.querySelectorAll('body > script[src^="https://captcha.px-cdn.net/"]'),
            (script) => script.parentElement.removeChild(script)
        );
        delete window.handleCaptcha;
    });
    afterAll(() => {
        window.setTimeout = setTimeout;
    });
    it('should add the script tag to document body', async() => {
        expect(
            document.querySelector(`body > script[src="${data.blockScript}"]`)
        ).toBe(null);
        openModal(data);
        expect(
            document.querySelector(`body > script[src="${data.blockScript}"]`)
        ).not.toBe(null);
    });
    it('should trigger original recaptcha handler', async() => {
        let originalCallbackCalled = false;
        function handleCaptcha() {
            originalCallbackCalled = true;
        }
        openModal(data);

        document.querySelector('dialog #px-captcha').innerHTML = '<div class="g-recaptcha" data-callback="handleCaptcha"></div>';
        window.handleCaptcha = handleCaptcha;

        const script = document.querySelector(`body > script[src="${data.blockScript}"]`);
        script.dispatchEvent(new Event('load'));

        // Waits on cycle (for script to run)
        expect(window.handleCaptcha).toBe(handleCaptcha);
        await wait();

        // Overrides handleCaptcha
        expect(window.handleCaptcha).not.toBe(handleCaptcha);
        window.handleCaptcha();

        // Calls original handleCaptcha
        expect(originalCallbackCalled).toBe(true);
    });
    it('should abort if script was not loaded', async() => {
        openModal(data);
        expect(document.querySelector('dialog')).not.toBe(null);
        await wait(4000);
        expect(document.querySelector('dialog')).toBe(null);
    });
    it('should continue when modal is successful', async() => {
        let result;
        openModal(data).then(
            () => { result = 'resolved'; }
        ).catch(
            () => { result = 'rejected'; }
        );
        window._pxOnCaptchaSuccess(true);
        await wait();
        expect(result).toBe('resolved');
    });
    it('should fail when modal is successful', async() => {
        let result;
        openModal(data).then(
            () => { result = 'resolved'; }
        ).catch(
            () => { result = 'rejected'; }
        );
        window._pxOnCaptchaSuccess(false);
        await wait();
        expect(result).toBe('rejected');
    });
    it('should throw an error when blockScript is not a string', async() => {
        await expect(openModal()).rejects.toEqual(new Error('PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received undefined.'));
    });
});
