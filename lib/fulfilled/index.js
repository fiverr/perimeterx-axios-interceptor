/**
 * Handle status code that lie within the range of 2xx
 * @param {net.Response} response
 * @returns response
 */
module.exports = (response) => Promise.resolve(response);
