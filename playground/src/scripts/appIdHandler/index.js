import debounce from '../debounce';

export default function appIdHandler(input, callback = () => null) {
    const debounced = debounce(() => {
        callback(input.value);
    });

    [
        'keyup',
        'change'
    ].forEach((event) => input.addEventListener(event, debounced));
}
