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
     * @param {number} [o.failureCount] Amount of times to block before success
     */
    constructor({ appId = PX_APP_ID, failureCount = 1 } = {}) {
        this.iterations = -1;
        this.failureCount = failureCount;
        this.blockResponse = PXResponse.blockResponse(appId);
    }

    /**
     * @returns {string} the default appID
     */
    static get defaultAppId() {
        return PX_APP_ID;
    }

    /**
     * PerimeterX 403 response body
     * @param {string} [appId]
     * @returns {object}
     */
    static blockResponse(appId = PX_APP_ID) {
        return {
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
     * Side effect of incrementing the request count
     * @returns {json}
     */
    get response() {
        this.iterations++;
        return this.iterations < this.failureCount ? this.blockResponse : 'Successful request';
    }

    /**
     * @returns {number} status code
     */
    get status() {
        return this.iterations < this.failureCount ? 403 : 200;
    }
};
