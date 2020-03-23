import serialiseForm from '../serialiseForm';

/**
 * @param {HTMLFormElement} form
 * @param {import("axios").AxiosInstance} axios
 * @param {function} [callback=console.info]
 */
export default function formHandler(form, axios, callback = console.info) {
    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();
            form.classList.add('loading');
            const { endpoint } = serialiseForm(event.target);
            const url = `${endpoint}`;

            axios.get(url)
                .then(({ data }) => form.classList.remove('loading') || callback(data))
                .catch(({ message }) => form.classList.remove('loading') || callback(message));
        },
        { capture: true }
    );
}
