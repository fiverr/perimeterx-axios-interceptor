/**
 * serialiseForm
 * @param {HTMLFormElement} form
 * @return {object}
 */
export default (form) => Object.assign(
    ...Array.from(form)
        .filter(({name}) => !!name)
        .map(({name, value}) => ({[name]: value}))
);
