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
        error.config = { url: 'https://website.net' };
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
    it('should break immediately is error body is empty', async() => {
        context.onerror = jest.fn();
        expect.assertions(2);
        const emptyError = {
            response: {
                status: 403,
                data: null
            }
        };
        const rejected = require('.').bind(
            Object.assign({}, context)
        );

        Promise.reject(emptyError).catch(rejected).catch((error) => {
            expect(context.onerror).not.toHaveBeenCalled();
            expect(error).toBe(emptyError);
        });
        resolver();
        await wait();
    });
    it('should resolve eventually only after challenge was resolved', async() => {
        let called = false;
        Promise.reject(error).catch(rejected).then(() => {
            called = true;
        }).catch(() => null);
        await wait();
        expect(called).toBe(false);
        resolver();
        await wait();
        expect(called).toBe(true);
    });
    it('should call onsuccess callbback with the request', async() => {
        let expected;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onsuccess: (request) => { expected = request; }
            })
        );
        Promise.reject(error).catch(rejected);
        await wait();
        resolver();
        await wait();
        expect(expected).toBe(error.config);
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
        let expected;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onintercept: (request) => { expected = request; }
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
        expect(expected).toBe(error.config);
    });
    it('should call onignore for requests that have been filtered out', async() => {
        error.config = { url: 'https://website.net/some/link' };
        let expected;
        let e;

        const rejected = require('.').bind(
            Object.assign({}, context, {
                filter: ({ path }) => !/^\/some\/link/.test(path.replace(/^https:\/\/website\.net/, '')),
                onignore: ({ url }) => { expected = url; },
                onintercept: () => { e = 'Should not have been called'; }
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
        expect(expected).toBe('https://website.net/some/link');
        expect(e).toBe(undefined);
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
        let expected;
        stack.enqueue = () => { throw new Error('Something must have gone terribly wrong'); };
        context.onerror = (error) => { expected = error; };
        Promise.reject(error).catch(rejected).catch(() => expect().toBe());
        resolver();
        await wait();
        expect(expected.message).toBe('Something must have gone terribly wrong');
        expect(expected.config).toBe(undefined);
        expect(JSON.parse(expected.toJSON().config).url).toBe('https://website.net');
    });
    it('should reject without onerror for non 403 errors', async() => {
        expect.assertions(0);
        context.onerror = () => expect().toBe();
        Promise.reject(new Error('Something must have gone terribly wrong')).catch(rejected).catch(() => null);
        resolver();
        await wait();
    });
});
