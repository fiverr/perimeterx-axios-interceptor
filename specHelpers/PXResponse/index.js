/**
 * @type {string}
 */
const PX_APP_ID = 'PX_1234';

/**
 * Response object with getters to allow moxios to return different
 * results for the same route based on the request count. This mimics
 * a request that's blocked and after exoneration is allowed.
 */
module.exports = class PXResponse {
    /**
     * @param {string} [o.appId]
     */
    constructor({ appId = PX_APP_ID } = {}) {
        this.iterations = 0;
        this.blockResponse = {
            appId,
            jsClientSrc: `https://client.perimeterx.net/${appId}/main.min.js`,
            firstPartyEnabled: false,
            vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
            uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
            hostUrl: 'https://www.website.net',
            blockScript: `https://captcha.px-cdn.net/${appId}/captcha.js`
        };
    }

    /**
     * @returns {string} the default appID
     */
    static get defaultAppId() {
        return PX_APP_ID;
    }

    /**
     * @returns {boolean} even iterations should get blocked
     */
    get even() {
        return this.iterations % 2 === 0;
    }

    /**
     * Increment iterations
     * @returns {void}
     */
    increment() {
        this.iterations++;
    }

    /**
     * Side effect of incrementing the request count
     * @returns {number} status code
     */
    get status() {
        const { even } = this;
        this.increment();
        return even ? 403 : 200;
    }

    /**
     * @returns {json}
     */
    get response() {
        return this.even ? this.blockResponse : { key: 'balue' };
    }
};
