import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import wait from '@lets/wait';
import { attach } from '../../..';
import mockRequests from './mockRequests';
import formHandler from './formHandler';
import populateForm from './populateForm';
import appIdHandler from './appIdHandler';

Object.assign(
    window,
    { regeneratorRuntime }
);

// Add a delay, for dramatic effect
const { get } = axios;
axios.get = (...args) => wait(200).then(() => get(...args));

console.debug('Attach axios instance');
attach(axios);

console.debug('Mock API endpoints');
mockRequests(axios);

console.debug('Disable submit for all forms');
[].forEach.call(
    document.forms,
    (form) => form.addEventListener(
        'submit',
        (event) => event.preventDefault(),
        { capture: true }
    )
);

console.debug('Attach App ID input handler');
appIdHandler(window.app_id_input, mockRequests.bind(null, axios));
console.debug('Populate form options');
populateForm(window.requests_form);
console.debug('Attach form handlers');
formHandler(window.requests_form, window.requests_select, axios);
