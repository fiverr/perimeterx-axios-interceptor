const { create } = require('axios');
const moxios = require('moxios');
const PXResponse = require('./specHelpers/PXResponse');

let attach, detach;

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

describe('perimeterx-axios-interceptor', () => {
    beforeAll(() => {
        jest.mock('./lib/openModal', () => jest.fn(() => null));
        ({ attach, detach } = require('.'));

    });
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
        moxios.stubRequest(REQUEST_PERIMETERX_BLOCK, new PXResponse({ appId: PXResponse.defaultAppId }));
        moxios.stubRequest(REQUEST_PERIMETERX_BLOCK_ALT, new PXResponse({ appId: PXResponse.defaultAppId }));

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
        expect(data).toEqual({key: 'balue'});
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
            appId: PXResponse.defaultAppId,
            path: '/perimeterx-block'
        });
    });
});
