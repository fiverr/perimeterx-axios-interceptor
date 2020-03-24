import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import wait from '@lets/wait';
import { attach } from '../../..';
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

console.debug('Attach axios instance');
attach(axios);

console.debug('Mock API endpoints');
mockRequests(axios);

const [ form ] = document.forms;
console.debug('Populate form options');
populateForm(form);
console.debug('Attach form handlers');
formHandler(form, axios);
