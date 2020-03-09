# perimeterx-axios-interceptor

## 🧱 Intercept requests which are blocked by PerimeterX - pop up the challenge and retry the request

### Implementation
```js
import axios from ‘axios’;
import { attach[, detach] } from ‘perimeterx-axios-interceptor’;

attach(axios, {
    before: () => isbot(navigator.userAgent),
    onsuccess: () => stats.count('axios.interceptor.perimeterx.success', 1),
    onfailure: () => stats.count('axios.interceptor.perimeterx.failure', 1),
    onerror: error => logger.error(error),
    disableCss: false, // default
});
```

### Behaviour details
Using the feature [Advanced Blocking Response](https://github.com/PerimeterX/perimeterx-nginx-plugin#-advanced-blocking-response) featured in PX NginX Lua plugin

1. Request is blocked by PerimeterX (403)
1. Add recaptcha container and PerimeterX challenge
1. After challenge is resolved and user is exonerated - roll back to original request and continue flow

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
