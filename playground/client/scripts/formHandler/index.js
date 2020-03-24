import serialiseForm from '../serialiseForm';

/**
 * @param {HTMLFormElement} form
 * @param {import("axios").AxiosInstance} axios
 */
export default function formHandler(form, axios) {
    const textarea = form.querySelector('textarea');
    function callback(result) {
        form.classList.remove('loading');
        textarea.value = JSON.stringify(result);
    }

    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();
            form.classList.add('loading');
            const { endpoint } = serialiseForm(form);

            axios.get(endpoint)
                .then(({ data }) => callback(data))
                .catch(({ message }) => callback(message));
        },
        { capture: true }
    );
}
