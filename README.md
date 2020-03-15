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
    <h1>One Small Step</h1>
    <h2>Please check the box below to continue your normal visit</h2>
    <p>Don't worry - you're one click away.</p>
    <div id="px-captcha"></div>
    <aside>
        <p>We're dedicated to keeping the site safe from malicious visitors. Something in your behaviour has triggered our protection systems - We apologise for any inconvenience this process may have caused.</p>
        <ul>
            <li>Ad blocking or ad filtering software may interfere with our ability to identify you as human. Please exclude this website.</li>
            <li>Modifying your headers or user agent may trigger some of our detection tools. Make sure you don't have any browser extensions tampering with those.</li>
            <li>Make sure JavaScript is enabled in your browser.</li>
            <li>If you're still having trouble accessing the site, please contact customer support.</li>
        </ul>
    </aside>
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
