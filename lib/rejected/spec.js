const wait = require('@lets/wait');
const { blockResponse } = require('../../specHelpers/PXResponse');

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
    it('should resolve immediately if simulate mode is on', async() => {
        const rejected = require('.').bind(
            Object.assign({}, context, { simulate: true })
        );
        let called = false;

        Promise.reject(error).catch(rejected).catch((error) => {
            expect(error).toBe(error);
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
    it('should call onsuccess callbback with the request', async() => {
        let called = false;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onsuccess: (request) => {
                    expect(request).toBe(error.config);
                    called = true;
                }
            })
        );
        Promise.reject(error).catch(rejected);
        await wait();
        resolver();
        await wait();
        expect(called).toBe(true);
    });
    it('should call onfailure callbback with the request', async() => {
        let called = false;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onfailure: (request, rejection) => {
                    expect(request).toBe(error.config);
                    expect(rejection).toEqual(new Error('Something must have gone terribly wrong'));
                    called = true;
                }
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        rejecter(new Error('Something must have gone terribly wrong'));
        await wait();
        expect(called).toBe(true);
    });
    it('should call onintercept', async() => {
        let called = false;
        let request;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onintercept: (_request) => {
                    request = _request;
                    called = true;
                }
            })
        );
        Promise.reject(error).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
        expect(request).toBe(error.config);
        expect(called).toBe(true);
    });
    it('should not reach onintercept for non PerimeterX errors', async() => {
        let called = false;
        const rejected = require('.').bind(
            Object.assign({}, context, {
                onintercept: () => { called = true; }
            })
        );
        Promise.reject(new Error('Something must have gone terribly wrong')).catch(rejected).catch(() => null);
        await wait();
        resolver();
        await wait();
        expect(called).toBe(false);
    });
});
