const wait = require('@lets/wait');
const { removeCaptcha } = require('../UIElements');
const openModal = require('.');

const data = {
    blockScript: 'https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js'
};
const { setTimeout } = window;

function scriptLoaded() {
    const script = document.querySelector(`body > script[src="${data.blockScript}"]`);
    script.dispatchEvent(new Event('load'));
}

describe('lib/openModal', () => {
    beforeAll(() => {
        // Speed things up
        window.setTimeout = (fn, ms = 1000) => setTimeout(fn, ms / 1000);
    });
    afterEach(() => {
        removeCaptcha();
        [].forEach.call(
            document.querySelectorAll('body > script[src^="https://captcha.px-cdn.net/"], head > link[href^="https://captcha.px-cdn.net/"]'),
            (element) => element.parentElement.removeChild(element)
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
        scriptLoaded();
        expect(
            document.querySelector(`body > script[src="${data.blockScript}"]`)
        ).not.toBe(null);
    });
    it('should add the link preload', async() => {
        expect(
            document.querySelector(`head > link[rel="preload"][href="${data.blockScript}"]`)
        ).toBe(null);
        openModal(data);
        scriptLoaded();
        expect(
            document.querySelector(`head > link[rel="preload"][href="${data.blockScript}"]`)
        ).not.toBe(null);
    });
    it('should trigger original recaptcha handler', async() => {
        expect.assertions(3);
        function handleCaptcha() {
            expect().toBe();
        }
        openModal(data);
        scriptLoaded();

        document.querySelector('dialog #px-captcha').innerHTML = '<div class="g-recaptcha" data-callback="handleCaptcha"></div>';
        window.handleCaptcha = handleCaptcha;

        scriptLoaded();

        // Waits on cycle (for script to run)
        expect(window.handleCaptcha).toBe(handleCaptcha);
        await wait();

        // Overrides handleCaptcha
        expect(window.handleCaptcha).not.toBe(handleCaptcha);
        window.handleCaptcha();
    });
    it('should abort if script was not loaded', async() => {
        expect.assertions(3);
        openModal(data).catch(
            (error) => {
                expect(error.message).toEqual('PerimeterX Axios Interceptor: Failed to load script resource after 3000ms.');
            }
        );
        expect(document.querySelector('dialog')).not.toBe(null);
        await wait(4000);
        expect(document.querySelector('dialog')).toBe(null);
    });
    it('should continue when modal is successful', (done) => {
        expect.assertions(1);

        openModal(data).then(
            () => expect().toBe(done())
        ).catch(
            (error) => done(error)
        );
        scriptLoaded();
        window._pxOnCaptchaSuccess(true);
        wait();
    });
    it('should fail when modal is successful', (done) => {
        expect.assertions(1);
        openModal(data).then(
            () => done.fail('This should not have been resolved')
        ).catch(
            () => expect().toBe(done())
        );
        window._pxOnCaptchaSuccess(false);
        wait();
    });
    it('should throw an error when blockScript is not a string', async() => {
        await expect(openModal()).rejects.toEqual(new Error('PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received undefined.'));
    });
});
