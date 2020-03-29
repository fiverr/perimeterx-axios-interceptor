import { endpoints } from '../mockRequests';

/**
 * populateForm: Populate select with options respective to mock endpoints
 * @returns {void}
 */
export default function populateForm() {
    const fragment = document.createDocumentFragment();
    endpoints.forEach(
        ({text, value}) => fragment.appendChild(createOption(text, value))
    );
    document.querySelector('select').appendChild(fragment);
}

/**
 * @param {string} text
 * @param {string} value
 * @returns {HTMLOptionElement}
 */
function createOption(text, value) {
    const option = document.createElement('option');
    option.value = value;
    option.appendChild(document.createTextNode(text));
    return option;
}
