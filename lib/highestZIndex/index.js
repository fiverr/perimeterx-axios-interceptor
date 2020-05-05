/**
 * Max z-index supported (highest int32)
 * @type {number}
 */
const MAX_Z_INDEX = Math.pow(2, 31) - 1;

/**
 * Find the z-index of a given element
 * @param {HTMLElement}
 * @returns {number}
 */
const findZIndex = (element) => Number(
    document.defaultView.getComputedStyle(element, null).getPropertyValue('z-index')
);

/**
 * Figure out the required zIndex to be on top of everything
 * @param {number} highest Initial zIndex
 * @returns {number} desired zIndex
 */
module.exports = function highestZIndex(highest = 0) {
    try {
        const elements = document.querySelectorAll('body *').entries();
        let value, done;

        while ({ value, done } = elements.next()) { // eslint-disable-line no-cond-assign
            if (done) { break; }

            const [ , element ] = value;
            const zIndex = findZIndex(element);

            if (Number.isNaN(zIndex)) { continue; }

            highest = Math.max(highest, zIndex);

            if (highest >= MAX_Z_INDEX) {
                return MAX_Z_INDEX; // Short circuit at max value
            }
        }

        return highest + 1;
    } catch (_) {
        return MAX_Z_INDEX;
    }
};
