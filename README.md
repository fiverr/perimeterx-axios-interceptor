# perimeterx-axios-interceptor

## 🧱 Intercept requests which are blocked by PerimeterX - pop up the challenge and retry the request

### Implementation
```js
import axios from ‘axios’;
import { attach[, detach] } from ‘perimeterx-axios-interceptor’;

attach(axios, {
    filter: () => !isbot(navigator.userAgent),
    onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
    onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
    onerror: error => logger.error(error),
    customClass: 'my-challenge-popup',
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
#### `filter` {function}
Filter function is fired **before** the intercepting function. If filter is passed as an argument, it **must return a truthy value** for the interceptor to fulfil it's role. **Falsy values will result in the interceptor passing the response as is**.
It's signature includes the following named arguments:

| Name | Type | Meaning | Usage
| - | - | - | -
| `path` | string | Request original path | `{ filter: ({ path }) => !/^\/(tracking\|beacon)(\/\|$)/.test(path) }`
| `appId` | string | PerimeterX Application ID | `{ filter: ({ appId }) => appId === window._pxAppId }`
