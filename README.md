# perimeterx-axios-interceptor

## 🧱 Intercept requests which are blocked by PerimeterX - pop up the challenge and retry the request

### Implementation
```js
import axios from ‘axios’;
import { attach[, detach] } from ‘perimeterx-axios-interceptor’;

attach(axios, {
    filter: () => !isbot(navigator.userAgent),
    onerror: error => logger.error(error),
    onintercept: () => stats.count('axios.interceptor.perimeterx.intercept', 1),
    onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
    onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
    simulate: true,
    modalConfig: {
        className: 'my-challenge-popup',
        title: 'Are you human?',
        subtitle: 'Please complete the challenge',
        quickfixes: [
            '1. Disable adblocker',
            '2. Enable Javascript'
        ],
        suffix: 'Still having issues? Contact support at support@example.com'
    }
});
```

### Behaviour details
Using the feature [Advanced Blocking Response](https://github.com/PerimeterX/perimeterx-nginx-plugin#-advanced-blocking-response) featured in PX NginX Lua plugin

1. Request is blocked by PerimeterX (403)
1. Add recaptcha container and PerimeterX challenge
1. Challenge is resolved by user (user is exonerated)
1. Replay original request and resolve original promise

| ![](https://user-images.githubusercontent.com/516342/76226762-fd873f80-6226-11ea-83df-2dfbb51b1757.png)
| -

```html
<dialog class="perimeterx-async-challenge" open>
  <div>
    <p class="title">One Small Step</p>
    <p class="subtitle">Please check the box below to continue your normal visit</p>
    <div id="px-captcha" class="challenge-box">
    <p class="quickfix">• Please exclude this website from ad blocking or ad filtering software.</p>
    <p class="quickfix">• Make sure you don't have any browser extensions tampering with request headers or user agent string.</p>
    <p class="quickfix">• Make sure JavaScript is enabled in your browser.</p>
    <p>If you're still having trouble accessing the site, please contact customer support.</p>
    <style> {...} </style>
  </div>
</dialog>
<script src="https://captcha.px-cdn.net/<PERIMETERX_APP_IP>/captcha.js"></script>
```

### API
#### 1st argument: `axios`
This is the Axios instance this plugin will intercept. If you use a global axios instance, just pass that one in
#### 2nd argument: options
This is an optional object. All of its properties are also optional:
##### `filter` {function}
Filter function is fired **before** the intercepting function. If filter is passed as an argument, it **must return a truthy value** for the interceptor to fulfil it's role. **Falsy values will result in the interceptor passing the response as is**.
It's signature includes the following named arguments:

| Name | Type | Meaning | Usage
| - | - | - | -
| `path` | string | Request original path | `{ filter: ({ path }) => !/^\/(tracking\|beacon)(\/\|$)/.test(path) }`
| `appId` | string | PerimeterX Application ID | `{ filter: ({ appId }) => appId === window._pxAppId }`

##### `onerror` {function}
This function is called when an internal error happened with this interceptor
The signature includes the error:
```js
{ onerror: (error) => logger.error(error) }
```
##### `onintercept` {function}
This function is called on every time a request is recognised as a PerimeterX block.
The signature includes the original request object (axios.config):
```js
{ onintercept: (request) => logger.info({ message: 'Axios intercepted a PerimeterX block response', url: request.url }) }
```
##### `onsuccess` {function}
This function is called when a challenge was successfully completed.
The signature includes the original request object (axios.config):
```js
{ onsuccess: (request) => logger.info({ message: 'Axios interceptor exonerated request', url: request.url }) }
```
##### `onfailure` {function}
This function is called when a challenge was successfully completed.
The signature includes the original request object (axios.config) and the rejection error:
```js
{ onfailure: (request, error) => logger.info({ message: 'Axios interceptor failed to exonerate request', url: request.url, stack: error.stack }) }
```
##### `simulate` {boolean}
Set "simulate" to a truthy value to allow monitoring without prompting users with exoneration.
The callback `onintercept` will fire, the rest will not. The promise will be rejected with the PerimeterX 403 response.
##### `modalConfig` {object}
This object allows configuration of the modal GUI:

- className (`{string}`): Add custom className to modal
    - **Default**: None
- title (`{string}`): Replace or disable default title
    - **Default**: "One Small Step"
- subtitle (`{string}`): Replace or disable default subtitle
    - **Default**: "Please check the box below to continue your normal visit"]
- quickfixes (`{string[]}`): Replace or disable default quick fixes (list)
    - **Default**:
        - "• Please exclude this website from ad blocking or ad filtering software."
        - "• Make sure you don't have any browser extensions tampering with request headers or user agent string.",
        - "• Make sure JavaScript is enabled in your browser."
- suffix (`{string}`): Replace or disable default suffix
    - **Default**: "If you're still having trouble accessing the site, please contact customer support."
- timeout (`{number}`): Time, in milliseconds, to allow PerimeterX script to load before aborting
    - **Default**: 3000 (3 seconds)

> Setting "title", "subtitle", "quickfixes", or "suffix" to a falsy value (null, empty string...) will prevent them from being rendered to GUI.
