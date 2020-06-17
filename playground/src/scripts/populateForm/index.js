import { endpoints } from '../mockRequests';

/**
 * populateForm: Populate select with options respective to mock endpoints
 * @returns {void}
 */
export default function populateForm() {
    const fragment = document.createDocumentFragment();
    endpoints.forEach(
        ({ text, value }) => fragment.appendChild(createOption(text, value))
    );
    const existing = document.querySelector('#request_form button');
    existing.parentNode.insertBefore(fragment, existing);
}

/**
 * @param {string} text
 * @param {string} value
 * @returns {HTMLOptionElement}
 */
function createOption(text, value) {
    const button = document.createElement('button');
    button.name = value;
    button.appendChild(document.createTextNode(text));
    return button;
}
