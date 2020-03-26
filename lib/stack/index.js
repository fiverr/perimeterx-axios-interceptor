// const key = Symbol.for('perimeterx-axios-interceptor-stack');
// window[key] = window[key] || [];
const stack = [];

/**
 * Stack manager
 * @type {object}
 * @property {number} size Stack size
 */
module.exports = {
    get size() {
        return stack.length;
    },

    /**
     * Push callback to stack
     * @param {function} callback
     * @returns {number} Stack size
     */
    enqueue: (cb) => stack.push(cb),

    /**
     * Empty stack and call all callbacks
     * @paran {Any[]}
     * @returns {void}
     */
    release: function release(...args) {
        const cbs = stack.slice();
        stack.length = 0;
        cbs.forEach((cb) => cb(...args));
    }
};
