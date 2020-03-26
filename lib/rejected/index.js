const isPXResponse = require('../isPXResponse');
const openModal = require('../openModal');
const stack = require('../stack');

/**
 * Handle status codes that falls outside the range of 2xx
 * @param error AxiosError thrown by non 2xx responses
 * @returns Promise.reject<error>
 */
module.exports = function rejected(error) {
    const {
        axios,
        onerror = () => null,
        filter
    } = this;

    return new Promise(
        ((resolve, reject) => {
            try {
                const { response = {} } = error;
                const { data, status } = response;

                if (status !== 403 || !isPXResponse(data)) {
                    throw error;
                }
                const filtered = filter({
                    appId: data.appId,
                    path: error.config.url
                });
                if (!filtered) {
                    throw error;
                }

                const shouldOpenModal = stack.size === 0;

                // Go back to start, collect 200
                const resolution = (rejection) => rejection
                    ? reject(rejection)
                    : axios(error.config).then(resolve).catch(reject)
                ;
                stack.enqueue(resolution);
                shouldOpenModal && openModal(data).then(
                    () => console.log('Hello') || stack.release()
                ).catch(
                    (error) => stack.release(error)
                );
            } catch (_) {
                reject(error);
                onerror(_);
            }
        })
    );
};
