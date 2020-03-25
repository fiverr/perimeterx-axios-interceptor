/**
 * @param {HTMLSelectElement} select
 * @param {import("axios").AxiosInstance} axios
 */
export default function formHandler(form, select, axios) {
    const textarea = document.querySelector('textarea');
    function callback(result) {
        form.classList.remove('loading');
        textarea.value = JSON.stringify(result);
    }

    select.addEventListener(
        'change',
        () => {
            if (!select.value) {
                form.classList.remove('loading');
                textarea.value = '';
                return;
            }

            form.classList.add('loading');
            axios.get(select.value)
                .then(({ data }) => callback(data))
                .catch(({ message }) => callback(message));
        },
        { capture: true }
    );
}
