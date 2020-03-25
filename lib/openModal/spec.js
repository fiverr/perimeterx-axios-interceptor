const openModal = require('.');

const data = {
    blockScript: 'https://captcha.px-cdn.net/PXXXXXXXXX/captcha.js'
};

describe('lib/openModal', () => {
    const {confirm} = window;
    beforeEach(() => {
        window.confirm = () => true;
    });
    afterEach(() => {
        window.confirm = confirm;
    });
    it('should continue when modal is successful', async() => {
        await expect(openModal(data)).resolves.toBe(undefined);
    });
    it('should fail when modal is successful', async() => {
        window.confirm = () => false;
        await expect(openModal(data)).rejects.toEqual(new Error('PerimeterX Axios Interceptor: Failed to exonerate visitor.'));
    });
    it('should throw an error when blockScript is not a string', async() => {
        await expect(openModal()).rejects.toEqual(new Error('PerimeterX Axios Interceptor: Expected "blockScript" to be a string, instead received undefined.'));
    });
});
