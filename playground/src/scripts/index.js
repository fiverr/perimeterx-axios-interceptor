import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import wait from '@lets/wait';
import { attach, detach } from '../../..';
import mockRequests from './mockRequests';
import formHandler from './formHandler';
import populateForm from './populateForm';

Object.assign(
    window,
    { regeneratorRuntime }
);

// Add a delay, for dramatic effect
const { get } = axios;
axios.get = (...args) => wait(200).then(() => get(...args));

function toggleSettings(boolean) {
    console.debug('Detach axios instance');
    detach(axios);

    console.debug(`Attach axios instance with ${boolean ? 'custom' : 'default'} settings`);
    boolean
        ? attach(axios, {
            modalConfig: {
                className: 'my-challenge-popup',
                title: 'Are you human?',
                subtitle: 'Please complete the challenge',
                quickfixes: [
                    '1. Disable adblocker',
                    '2. Enable Javascript'
                ],
                contactSupport: 'Still having issues? Contact support at support@example.com'
            }
        })
        : attach(axios)
    ;
}
toggleSettings();
window.toggle_custom_settings.addEventListener('change', () => toggleSettings(window.toggle_custom_settings.checked));

console.debug('Disable submit for all forms');
[].forEach.call(
    document.forms,
    (form) => form.addEventListener(
        'submit',
        (event) => event.preventDefault(),
        { capture: true }
    )
);

console.debug('Search appId in query string');
const [, appId] = window.location.search.match(/(?:\?|&)appId=(.*)(&|$)/) || [];
console.debug('Mock API endpoints');
mockRequests(axios, appId);
console.debug('Attach App ID input handler');
window.app_id_input.value = appId || '';
console.debug('Populate form options');
populateForm();
console.debug('Attach form handlers');
formHandler({
    input: window.app_id_input,
    select: window.requests_select,
    axios
});
