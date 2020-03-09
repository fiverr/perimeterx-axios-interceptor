const fulfilled = require('.');

describe('lib/fulfilled', () => {
    it('should pass promises through', async() => {
        const fn = new Promise((resolve) => resolve('Pass'));
        expect(await fn.then(fulfilled)).toBe('Pass');
    });
});
