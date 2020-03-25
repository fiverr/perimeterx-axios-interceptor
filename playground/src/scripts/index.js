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
appIdHandler(window.app_id_input, mockRequests.bind(null, axios, appId));
console.debug('Populate form options');
populateForm(window.requests_form);
console.debug('Attach form handlers');
formHandler(window.requests_form, window.requests_select, axios);
