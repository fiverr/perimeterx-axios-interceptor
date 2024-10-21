const isPXResponse = require('.');

describe('lib/isPXResponse', () => {
    it('should recognise the object returned from PerimeterX', () => {
        expect(isPXResponse({
            appId: '<PX_APP_ID>',
            jsClientSrc: 'https://client.px-cdn.net/<PX_APP_ID>/main.min.js',
            firstPartyEnabled: false,
            vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
            uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
            hostUrl: 'https://www.website.net',
            blockScript: 'https://captcha.px-cdn.net/<PX_APP_ID>/captcha.js'
        })).toBe(true);
    });

    it('should only require what is necessary', () => {
        expect(isPXResponse({
            appId: '<PX_APP_ID>',
            jsClientSrc: 'https://client.px-cdn.net/<PX_APP_ID>/main.min.js',
            blockScript: 'https://captcha.px-cdn.net/<PX_APP_ID>/captcha.js'
        })).toBe(true);
    });

    it('should ignore unexpected entries', () => {
        expect(isPXResponse({
            appId: '<PX_APP_ID>',
            jsClientSrc: 'https://client.px-cdn.net/<PX_APP_ID>/main.min.js',
            blockScript: 'https://captcha.px-cdn.net/<PX_APP_ID>/captcha.js',
            extra: 'something'
        })).toBe(true);
    });

    it('should fail if a required item is missing', () => {
        expect(isPXResponse({
            appId: '<PX_APP_ID>',
            jsClientSrc: 'https://client.px-cdn.net/<PX_APP_ID>/main.min.js',
            firstPartyEnabled: false,
            vid: '2b99ec08-3a22-49f0-a289-a4a6c330b059',
            uuid: '610a4a35-c45f-4cae-bc58-5abac3a4cdcd',
            hostUrl: 'https://www.website.net'
        })).toBe(false);
    });
});
