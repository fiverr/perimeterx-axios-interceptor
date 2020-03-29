const wait = require('@lets/wait');
const { blockResponse } = require('../../specHelpers/PXResponse');

let rejected;
let resolver = () => null;
const error = {
    response: {
        status: 403,
        data: blockResponse()
    },
    config: {
        url: 'https://website.net'
    }
};
const context = {
    axios: () => Promise.resolve(),
    filter: () => true
};

describe('lib/rejected', () => {
    beforeAll(() => {
        jest.mock(
            '../openModal',
            () => jest.fn(
                () => new Promise((resolve) => { resolver = resolve; })
            )
        );
        rejected = require('.').bind(context);
    });
    afterAll(() => {
        jest.unmock('../openModal');
        delete require.cache[require.resolve('.')];
    });
    it('should resolve immediately if this is not a PerimeterX response', async() => {
        const myError = new Error('Something must have gone terribly wrong');
        let called = false;

        Promise.reject(myError).catch(rejected).catch((error) => {
            expect(error).toBe(myError);
            called = true;
        });

        resolver();
        await wait();

        expect(called).toBe(true);
    });
    it('should resolve eventually only after challenge was resolved', async() => {
        let called = false;
        Promise.reject(error).catch(rejected).then(() => {
            called = true;
        });
        await wait();
        expect(called).toBe(false);
        resolver();
        await wait();
        expect(called).toBe(true);
    });
});
