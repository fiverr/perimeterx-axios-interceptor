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
        filter,
        onintercept,
        onsuccess,
        onfailure,
        onerror,
        simulate,
        modalConfig
    } = this;

    return new Promise(
        ((resolve, reject) => {
            try {
                const { response = {} } = error;
                const { data, status } = response;

                if (status !== 403 || !isPXResponse(data)) {
                    reject(error);
                    return;
                }
                const filtered = filter({
                    appId: data.appId,
                    path: error.config.url
                });
                if (!filtered) {
                    error.unintercepted = true;
                    reject(error);
                    return;
                }

                onintercept(error.config);

                // Simulate mode - report only
                if (simulate) {
                    reject(error);
                    return;
                }

                const shouldOpenModal = stack.size === 0;

                // Go back to start, collect 200
                const resolution = (rejection) => rejection
                    ? reject(rejection)
                        || onfailure(error.config, rejection)
                    : axios(error.config).then(resolve).catch(reject)
                        && onsuccess(error.config)
                ;

                stack.enqueue(resolution);
                shouldOpenModal && openModal(data, modalConfig).then(
                    () => stack.release()
                ).catch(
                    (error) => stack.release(error)
                );
            } catch (_) {
                reject(error);
                _.toJSON = () => ({
                    message: _.message,
                    stack: _.stack,
                    code: 'AXIOS_INTERCEPTOR_ERROR',
                    config: JSON.stringify(error.config)
                });
                onerror(_);
            }
        })
    );
};
