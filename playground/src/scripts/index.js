import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import wait from '@lets/wait';
import { attach, detach } from '../../..';
import mockRequests from './mockRequests';
import formHandler from './formHandler';
import populateForm from './populateForm';
import { config, useCustomModal, simulate } from './config';
import debug from './debug';

Object.assign(
    window,
    { regeneratorRuntime }
);

// Add a delay, for dramatic effect
const { get } = axios;
axios.get = (...args) => wait(200).then(() => get(...args));

{
    const toggle = () => {
        debug('Detach axios instance');
        detach(axios);
        useCustomModal(window.toggle_custom_settings.checked);
        debug('Reattach axios instance');
        attach(axios, config);
    };
    window.toggle_custom_settings.addEventListener('change', toggle);
}

{
    const toggle = () => {
        debug('Detach axios instance');
        detach(axios);
        simulate(window.toggle_simulate_mode.checked);
        debug('Reattach axios instance');
        attach(axios, config);
    };
    window.toggle_simulate_mode.addEventListener('change', toggle);
}

{
    const toggle = () => document.body.classList.toggle('logs', !window.toggle_log.checked);
    window.toggle_log.addEventListener('change', toggle);
    toggle();
}

{
    const toggle = () => document.body.classList.toggle('instructions', !window.toggle_instructions.checked);
    window.toggle_instructions.addEventListener('change', toggle);
    toggle();
}


attach(axios, config);

debug('Disable submit for all forms');
[].forEach.call(
    document.forms,
    (form) => form.addEventListener(
        'submit',
        (event) => event.preventDefault(),
        { capture: true }
    )
);

debug('Search appId in query string');
const [, appId] = window.location.search.match(/(?:\?|&)appId=(.*)(&|$)/) || [];
debug('Mock API endpoints');
mockRequests(axios, appId);
debug('Attach App ID input handler');
window.app_id_input.value = appId || '';
debug('Populate form options');
populateForm();
debug('Attach form handlers');
formHandler({
    input: window.app_id_input,
    select: window.requests_select,
    axios
});

document.querySelector('kbd').innerHTML = [ location.origin, location.pathname, '?appId=PXXXXXXXXX' ].join('');
