import regeneratorRuntime from 'regenerator-runtime';
import axios from 'axios';
import { attach } from '../../..';
import mockRequests from './mockRequests';
import formHandler from './formHandler';
import populateForm from './populateForm';

Object.assign(
    window,
    { regeneratorRuntime }
);

console.debug('Attach axios instance');
attach(axios);

console.debug('Mock API endpoints');
mockRequests();

const [ form ] = document.forms;
const textarea = document.querySelector('textarea');
console.debug('Populate form options');
populateForm(form);
console.debug('Attach form handlers');
formHandler(form, axios, (result) => {
    textarea.value = JSON.stringify(result);
});
