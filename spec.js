const { create } = require('axios');
const moxios = require('moxios');
const { attach, detach } = require('.');

let axios;
let resolved = false;
let rejected = false;

describe('perimeterx-axios-interceptor', () => {
    beforeAll(() => {
        moxios.install();

        moxios.stubRequest('/natural-fail', {
            status: 404,
            response: { key: 'balue' }
        });

        moxios.stubRequest('/perimeterx-block', {
            status: 403,
            response: {
                appId: '<PX_APP_ID>',
                jsClientSrc: 'https://client.perimeterx.net/<PX_APP_ID>/main.min.js',
                firstPartyEnabled: 'false',
                vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
                uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
                hostUrl: 'https://www.website.net',
                blockScript: 'https://captcha.px-cdn.net/<PX_APP_ID>/captcha.js'
            }
        });
    });
    beforeEach(() => {
        axios = create();
        resolved = false;
        rejected = false;
    });
    afterAll(async() => {
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
        await axios.get('/natural-fail').then(() => {
            resolved = true;
        }).catch(() => {
            rejected = true;
        });
        expect(resolved).toBe(false);
        expect(rejected).toBe(true);
    });

    it('should intercept perimeterx errors', async() => {
        attach(axios);
        await axios.get('/perimeterx-block').then(() => {
            resolved = true;
        }).catch(() => {
            rejected = true;
        });
        expect(resolved).toBe(true);
        expect(rejected).toBe(false);
    });
});
