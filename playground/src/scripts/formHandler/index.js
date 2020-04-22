import debounce from '../debounce';
import mockRequests from '../mockRequests';
import debug from '../debug';

/**
 * @param {HTMLSelectElement} select
 * @param {import("axios").AxiosInstance} axios
 */
export default function formHandler({ input, select, axios }) {
    const textarea = document.querySelector('textarea');
    function callback(result) {
        debug(result);
        document.body.classList.remove('loading');
        textarea.value = [result, textarea.value].filter(Boolean).join('\n');
    }

    select.addEventListener(
        'change',
        () => {
            if (!select.value) {
                callback('-- Reset --');
                mockRequests(axios, input.value);
                return;
            }

            document.body.classList.add('loading');

            if (select.value.includes(',')) {
                select.value.split(',').forEach(
                    (url) => axios.get(url)
                        .then(({ data }) => callback(data))
                        .catch(({ message }) => callback(message))
                );
                return;
            }

            axios.get(select.value)
                .then(({ data }) => callback(data))
                .catch(({ message }) => callback(message));
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
