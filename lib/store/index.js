/**
 * @type {array}
 */
const store = [];

/**
 * @param any
 */
const keyIs = (k) => ({ key }) => k === key;

/**
 * @type {object}
 */
const map = {

    /**
     * Return a boolean asserting whether a key exists in one of the store members
     * @param {any} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== undefined;
    },

    /**
     * Returns the value of store object associated to the key, or undefined if there is none
     * @param {any} key
     * @returns {any|undefined}
     */
    get(key) {
        const item = store.find(keyIs(key));
        return item && item.value;
    },

    /**
     * Sets the value on a store object with matching key. If none was found it will be created
     * @param {any} key
     * @param {any} value
     * @returns {self}
     */
    set(key, value) {
        const item = store.find(keyIs(key));
        if (item) {
            item.value = value;
        } else {
            store.push({ key, value });
        }
        return this;
    },

    /**
     * Remove a store object with matching key and return true. Return false if there was no matching object.
     * @param {any} key
     * @returns {boolean}
     */
    delete(key) {
        const index = store.findIndex(keyIs(key));
        const exists = index !== -1;
        exists && store.splice(index, 1);
        return exists;
    }
};

/**
 * Offer support to browsers with no Map implementation
 * @returns {Map|object}
 */
module.exports = () => typeof Map === 'function'
    ? new Map()
    : map
;
