const wait = require('@lets/wait');
const { blockResponse } = require('../../specHelpers/PXResponse');
const stack = require('../stack');

const { enqueue } = stack;

let rejected;
let resolver = () => null;
let rejecter = () => null;
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
    filter: () => true,
    onintercept: () => null,
    onignore: () => null,
    onsuccess: () => null,
    onfailure: () => null,
    onerror: () => null
};

describe('lib/rejected', () => {
    beforeAll(() => {
        jest.mock(
            '../openModal',
            () => jest.fn(
                () => new Promise((resolve, reject) => {
                    resolver = resolve;
                    rejecter = reject;
                })
            )
        );
        rejected = require('.').bind(context);
    });
    afterEach(() => {
        stack.enqueue = enqueue;
        context.onerror = () => null;
    });
    afterAll(() => {
        jest.unmock('../openModal');
        delete require.cache[require.resolve('.')];
    });
    it('should resolve immediately if this is not a PerimeterX response', async() => {
        expect.assertions(1);
        const myError = new Error('Something must have gone terribly wrong');

        Promise.reject(myError).catch(rejected).catch((error) => {
            expect(error).toBe(myError);
        });

        resolver();
        await wait();
    });
    it('should resolve immediately if simulate mode is on', async() => {
        expect.assertions(1);
        const rejected = require('.').bind(
            Object.assign({}, context, { simulate: true })
        );
        Promise.reject(error).catch(rejected).catch((error) => {
            expect(error).toBe(error);
        });
        resolver();
        await wait();
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
    it('should call onsuccess callbback with the request', async() => {
        expect.assertions(1);
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onsuccess: (request) => {
                    expect(request).toBe(error.config);
                }
            })
        );
        Promise.reject(error).catch(rejected);
        await wait();
        resolver();
        await wait();
    });
    it('should call onfailure callbback with the request', async() => {
        expect.assertions(2);
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onfailure: (request, rejection) => {
                    expect(request).toBe(error.config);
                    expect(rejection).toEqual(new Error('Something must have gone terribly wrong'));
                }
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        rejecter(new Error('Something must have gone terribly wrong'));
        await wait();
    });
    it('should call onintercept', async() => {
        expect.assertions(1);
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onintercept: (request) => expect(request).toBe(error.config)
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
    });
    it('should not reach onintercept for non PerimeterX errors', async() => {
        expect.assertions(0);
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onintercept: () => expect().toBe()
            })
        );
        Promise.reject(new Error('Something must have gone terribly wrong')).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
    });
    it('should attach request details to onerror error', async() => {
        expect.assertions(4);
        stack.enqueue = () => { throw new Error('Something must have gone terribly wrong'); };
        context.onerror = (err) => {
            expect(err.message).toBe('Something must have gone terribly wrong');
            expect(err.config).toBe(undefined);
            expect(
                err.toJSON().config.url
            ).toBe('https://website.net');
        };

        Promise.reject(error).catch(rejected).catch(() => expect().toBe());

        resolver();
        await wait();
    });
    it('should reject without onerror for non 403 errors', async() => {
        expect.assertions(0);
        context.onerror = () => expect().toBe();
        Promise.reject(new Error('Something must have gone terribly wrong')).catch(rejected).catch(() => null);
        resolver();
        await wait();
    });
});
