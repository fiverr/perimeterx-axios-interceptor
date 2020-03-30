import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import wait from '@lets/wait';
import { attach, detach } from '../../..';
import mockRequests from './mockRequests';
import formHandler from './formHandler';
import populateForm from './populateForm';
import { config, useCustomModal, simulate } from './config';

Object.assign(
    window,
    { regeneratorRuntime }
);

// Add a delay, for dramatic effect
const { get } = axios;
axios.get = (...args) => wait(200).then(() => get(...args));

window.toggle_custom_settings.addEventListener('change', () => toggleSettings(window.toggle_custom_settings.checked));
function toggleSettings(boolean) {
    console.debug('Detach axios instance');
    detach(axios);
    useCustomModal(boolean);
    console.debug('Reattach axios instance');
    attach(axios, config);
}

window.toggle_simulate_mode.addEventListener('change', () => toggleSimulate(window.toggle_simulate_mode.checked));
function toggleSimulate(boolean) {
    console.debug('Detach axios instance');
    detach(axios);
    simulate(boolean);
    console.debug('Reattach axios instance');
    attach(axios, config);
}

attach(axios, config);

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
