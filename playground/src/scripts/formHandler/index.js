import debounce from '../debounce';
import mockRequests from '../mockRequests';

/**
 * @param {HTMLSelectElement} select
 * @param {import("axios").AxiosInstance} axios
 */
export default function formHandler({ input, form, axios }) {
    const textarea = document.querySelector('textarea');
    function callback(result) {
        document.body.classList.remove('loading');
        textarea.value = [result, textarea.value].filter(Boolean).join('\n');
    }

    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();

            const { name } = event.submitter;

            if (!name) {
                callback('-- Reset --');
                mockRequests(axios, input.value);
                return;
            }

            document.body.classList.add('loading');

            if (name.includes(',')) {
                name.split(',').forEach(
                    (url) => axios.get(url)
                        .then(({ data }) => callback(data))
                        .catch(({ message }) => callback(message))
                );
                return;
            }

            axios.get(name)
                .then(({ data }) => callback(data))
                .catch(({ message, ignored }) => ignored
                    ? callback(message) || mockRequests.replay()
                    : callback(message))
            ;
        },
        { capture: true }
    );

    [
        'keyup',
        'change'
    ].forEach(
        (event) => input.addEventListener(
            event,
            debounce(() => mockRequests(axios, input.value)),
            { capture: true }
        )
    );
}
