const isPXResponse = require('../isPXResponse');

/**
 * Handle status codes that falls outside the range of 2xx
 * @param error AxiosError thrown by non 2xx responses
 * @returns Promise.reject<error>
 */
module.exports = async function rejected(error) {
    try {
        const { response = {} } = error;
        const { data, status } = response;

        if (status !== 403 || !isPXResponse(data)) {
            throw error;
        }

        // TODO: Trigger challenge here

        // Go back to start, do not collect $200
        Promise.resolve(
            this.axios(error.config)
        );
    } catch (_) {
        this.onerror && this.onerror(_);

        throw error;
    }
};
