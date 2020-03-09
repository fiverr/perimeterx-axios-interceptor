const rejected = require('.');

describe('lib/rejected', () => {
    it('should resolve immediately if this is not a PerimeterX response', async() => {
        const myError = new Error('Something must have gone terribly wrong');
        let called = false;
        const fn = new Promise((resolve) => resolve(myError));

        await fn.then(rejected).catch((error) => {
            expect(error).toBe(myError);
            called = true;
        });

        expect(called).toBe(true);
    });
});
