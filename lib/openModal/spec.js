const wait = require('@lets/wait');
const openModal = require('.');

const data = {
    blockScript: 'https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js'
};

describe('lib/openModal', () => {
    it('should continue when modal is successful', async() => {
        let result;
        openModal(data).then(
            () => { result = 'resolved' }
        ).catch(
            () => { result = 'rejected' }
        );
        window._pxOnCaptchaSuccess(true);
        await wait();
        expect(result).toBe('resolved');
    });
    it('should fail when modal is successful', async() => {
        let result;
        openModal(data).then(
            () => { result = 'resolved' }
        ).catch(
            () => { result = 'rejected' }
        );
        window._pxOnCaptchaSuccess(false);
        await wait();
        expect(result).toBe('rejected');
    });
    it('should throw an error when blockScript is not a string', async() => {
        await expect(openModal()).rejects.toEqual(new Error('PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received undefined.'));
    });
});
