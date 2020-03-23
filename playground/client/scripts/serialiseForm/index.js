/**
 * serialiseForm
 * @param {HTMLFormElement} form
 * @return {object}
 */
export default (form) => Object.assign(
    ...Array.from(form)
        .filter((e) => !!e.name)
        .map((i) => ({[i.name]: i.value}))
);
