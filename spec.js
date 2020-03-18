const { create } = require('axios');
const moxios = require('moxios');
const { attach, detach } = require('.');

let axios;
let resolved = false;
let rejected = false;
async function checkResolved(promise) {
    await promise.then(() => {
        resolved = true;
    }).catch(() => {
        rejected = true;
    });
}

const REQUEST_PERIMETERX_BLOCK = '/perimeterx-block';
const REQUEST_PERIMETERX_BLOCK_ALT = '/perimeterx-block-alt';
const REQUEST_NOT_FOUND = '/not-found';
const REQUEST_OKAY = '/okay';
const PX_APP_ID = 'PX_1234';

class PXResponse {
    constructor() {
        this.iterations = 0;
    }
    get status() {
        return this.iterations++ === 0
            ? 403
            : 200
        ;
    }
    get response() {
        return this.iterations === 0
            ? {
                appId: PX_APP_ID,
                jsClientSrc: `https://client.perimeterx.net/${PX_APP_ID}/main.min.js`,
                firstPartyEnabled: 'false',
                vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
                uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
                hostUrl: 'https://www.website.net',
                blockScript: `https://captcha.px-cdn.net/${PX_APP_ID}/captcha.js`
            }
            : 'success'
        ;
    }
}

describe('perimeterx-axios-interceptor', () => {
    beforeEach(() => {
        resolved = false;
        rejected = false;

        moxios.install();

        moxios.stubRequest(REQUEST_NOT_FOUND, {
            status: 404,
            response: 'Not found'
        });
        moxios.stubRequest(REQUEST_OKAY, {
            status: 200,
            response: 'Success'
        });
        moxios.stubRequest(REQUEST_PERIMETERX_BLOCK, new PXResponse());
        moxios.stubRequest(REQUEST_PERIMETERX_BLOCK_ALT, new PXResponse());

        axios = create();
    });
    afterEach(async() => {
        moxios.uninstall();
    });

    it('should add an interceptor (use), then remove it (eject)', () => {
        expect(axios.interceptors.response.handlers).toHaveLength(0);
        attach(axios);
        expect(axios.interceptors.response.handlers).toHaveLength(1);

        const [ handler ] = axios.interceptors.response.handlers;
        const keys = Object.keys(handler);
        expect(keys).toEqual(['fulfilled', 'rejected']);
        const types = Object.values(handler).map((value) => typeof value);
        expect(types).toEqual(['function', 'function']);

        detach(axios);
        expect(axios.interceptors.response.handlers).toEqual([null]);
    });

    it('should fall back to natural flow for non perimeterx errors', async() => {
        attach(axios);
        expect(axios.get(REQUEST_NOT_FOUND)).rejects.toThrow('Request failed with status code 404');
    });

    it('should bring perimeterx errors to resolve', async() => {
        attach(axios);
        const { data } = await axios.get(REQUEST_PERIMETERX_BLOCK);
        expect(data).toBe('success');
    });

    it('should call filter function', async() => {
        let filtered = 0;
        attach(axios, {
            filter: () => ++filtered
        });
        await checkResolved(
            axios.get(REQUEST_PERIMETERX_BLOCK)
        );
        expect(resolved).toBe(true);
        expect(rejected).toBe(false);
        expect(filtered).toBe(1);
    });

    it.each([true, 1, 'yes', {}])(
        'should filter in when function returns %p',
        async(item) => {
            attach(axios, {
                filter: () => item
            });
            await checkResolved(
                axios.get(REQUEST_PERIMETERX_BLOCK)
            );
            expect(resolved).toBe(true);
            expect(rejected).toBe(false);
        }
    );

    it.each([false, 0, '', null])(
        'should filter out when function returns %p',
        async(item) => {
            attach(axios, {
                filter: () => item
            });
            await checkResolved(
                axios.get(REQUEST_PERIMETERX_BLOCK)
            );
            expect(resolved).toBe(false);
            expect(rejected).toBe(true);
        }
    );

    it('should expost "path" and "appId" arguments to filter function', async() => {
        const args = {};
        attach(axios, {
            filter: (_args) => Object.assign(args, _args)
        });
        await axios.get(REQUEST_PERIMETERX_BLOCK).catch(() => null);
        expect(args).toEqual({
            appId: PX_APP_ID,
            path: '/perimeterx-block'
        });
    });
});
